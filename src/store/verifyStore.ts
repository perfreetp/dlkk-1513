import { create } from 'zustand';

export type CertType = 'birthCert' | 'fatherIdCard' | 'motherIdCard' | 'marriageCert';

export type CertReadStatus = 'pending' | 'reading' | 'success' | 'failed' | 'skipped';

export interface CertItem {
  type: CertType;
  name: string;
  status: CertReadStatus;
  progress: number;
  errorMsg?: string;
  ocrData?: Record<string, string>;
  electronicData?: Record<string, string>;
}

export type VerifyStatus = 'pending' | 'verifying' | 'passed' | 'failed';

export interface VerifyDetailItem {
  id: string;
  name: string;
  category: '证件一致性' | '材料完整性' | '信息有效性';
  status: 'passed' | 'failed' | 'warning';
  message: string;
}

interface VerifyState {
  certs: Record<CertType, CertItem>;
  overallProgress: number;
  verifyStatus: VerifyStatus;
  verifyDetails: VerifyDetailItem[];
  compareResults: Record<string, { electronic: string; ocr: string; match: boolean }>;

  setCertStatus: (type: CertType, status: CertReadStatus, progress?: number, errorMsg?: string) => void;
  setCertData: (type: CertType, data: { ocrData?: Record<string, string>; electronicData?: Record<string, string> }) => void;
  readAllCerts: () => Promise<void>;
  readSingleCert: (type: CertType) => Promise<void>;
  resetAllCerts: () => void;
  setVerifyStatus: (status: VerifyStatus) => void;
  setVerifyDetails: (details: VerifyDetailItem[]) => void;
  setCompareResults: (results: Record<string, { electronic: string; ocr: string; match: boolean }>) => void;
  runVerify: () => Promise<void>;
  resetVerify: () => void;
  calculateOverallProgress: () => void;
}

const initCerts: Record<CertType, CertItem> = {
  birthCert: {
    type: 'birthCert',
    name: '出生医学证明',
    status: 'pending',
    progress: 0,
  },
  fatherIdCard: {
    type: 'fatherIdCard',
    name: '父亲身份证',
    status: 'pending',
    progress: 0,
  },
  motherIdCard: {
    type: 'motherIdCard',
    name: '母亲身份证',
    status: 'pending',
    progress: 0,
  },
  marriageCert: {
    type: 'marriageCert',
    name: '结婚证',
    status: 'pending',
    progress: 0,
  },
};

const mockElectronicData: Record<CertType, Record<string, string>> = {
  birthCert: {
    新生儿姓名: '张小明',
    性别: '男',
    出生日期: '2026-05-20',
    出生时间: '08:30:00',
    出生地点: '杭州市第一人民医院',
    健康状况: '良好',
    出生证编号: 'H330100202605200001',
    签发机构: '杭州市第一人民医院',
    签发日期: '2026-05-25',
  },
  fatherIdCard: {
    姓名: '张伟',
    性别: '男',
    民族: '汉族',
    出生日期: '1988-03-15',
    住址: '浙江省杭州市西湖区文三路100号',
    公民身份号码: '330106198803151234',
    签发机关: '杭州市公安局西湖分局',
    有效期限: '2020.03.15-2040.03.15',
  },
  motherIdCard: {
    姓名: '李美丽',
    性别: '女',
    民族: '汉族',
    出生日期: '1990-07-22',
    住址: '浙江省杭州市西湖区文三路100号',
    公民身份号码: '330106199007225678',
    签发机关: '杭州市公安局西湖分局',
    有效期限: '2020.07.22-2040.07.22',
  },
  marriageCert: {
    男方姓名: '张伟',
    女方姓名: '李美丽',
    男方身份证号: '330106198803151234',
    女方身份证号: '330106199007225678',
    登记日期: '2015-10-01',
    结婚证字号: '浙杭西湖结字第010101号',
    登记机关: '杭州市西湖区民政局',
  },
};

const mockOcrData: Record<CertType, Record<string, string>> = {
  birthCert: {
    新生儿姓名: '张小明',
    性别: '男',
    出生日期: '2026-05-20',
    出生时间: '08:30:00',
    出生地点: '杭州市第一人民医院',
    健康状况: '良好',
    出生证编号: 'H330100202605200001',
    签发机构: '杭州市第一人民医院',
    签发日期: '2026-05-25',
  },
  fatherIdCard: {
    姓名: '张伟',
    性别: '男',
    民族: '汉族',
    出生日期: '1988-03-15',
    住址: '浙江省杭州市西湖区文三路100号',
    公民身份号码: '330106198803151234',
    签发机关: '杭州市公安局西湖分局',
    有效期限: '2020.03.15-2040.03.15',
  },
  motherIdCard: {
    姓名: '李美莉',
    性别: '女',
    民族: '汉族',
    出生日期: '1990-07-22',
    住址: '浙江省杭州市西湖区文三路100号',
    公民身份号码: '330106199007225679',
    签发机关: '杭州市公安局西湖分局',
    有效期限: '2020.07.22-2040.07.22',
  },
  marriageCert: {
    男方姓名: '张伟',
    女方姓名: '李美丽',
    男方身份证号: '330106198803151234',
    女方身份证号: '330106199007225678',
    登记日期: '2015-10-01',
    结婚证字号: '浙杭西湖结字第010101号',
    登记机关: '杭州市西湖区民政局',
  },
};

type SetState = {
  (partial: Partial<VerifyState>): void;
  (partial: (state: VerifyState) => Partial<VerifyState>): void;
};

const simulateProgress = (type: CertType, set: SetState): Promise<void> => {
  return new Promise((resolve) => {
    const cert = initCerts[type];
    set((state) => ({
      certs: {
        ...state.certs,
        [type]: { ...cert, status: 'reading', progress: 0 },
      },
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const shouldFail = false;
        const finalStatus: CertReadStatus = shouldFail ? 'failed' : 'success';
        set((state) => ({
          certs: {
            ...state.certs,
            [type]: {
              ...state.certs[type],
              status: finalStatus,
              progress: 100,
              errorMsg: shouldFail ? '证照读取失败，请重试' : undefined,
              electronicData: mockElectronicData[type],
              ocrData: mockOcrData[type],
            },
          },
        }));
        resolve();
      } else {
        set((state) => ({
          certs: {
            ...state.certs,
            [type]: { ...state.certs[type], status: 'reading', progress: Math.floor(progress) },
          },
        }));
      }
    }, 200);
  });
};

export const useVerifyStore = create<VerifyState>((set, get) => ({
  certs: JSON.parse(JSON.stringify(initCerts)),
  overallProgress: 0,
  verifyStatus: 'pending',
  verifyDetails: [],
  compareResults: {},

  calculateOverallProgress: () => {
    const { certs } = get();
    const values = Object.values(certs);
    const total = values.reduce((sum, c) => sum + c.progress, 0);
    set({ overallProgress: Math.floor(total / values.length) });
  },

  setCertStatus: (type, status, progress, errorMsg) => {
    set((state) => ({
      certs: {
        ...state.certs,
        [type]: {
          ...state.certs[type],
          status,
          progress: progress ?? state.certs[type].progress,
          errorMsg,
        },
      },
    }));
    get().calculateOverallProgress();
  },

  setCertData: (type, data) => {
    set((state) => ({
      certs: {
        ...state.certs,
        [type]: { ...state.certs[type], ...data },
      },
    }));
  },

  readAllCerts: async () => {
    const types: CertType[] = ['birthCert', 'fatherIdCard', 'motherIdCard', 'marriageCert'];
    for (const type of types) {
      await simulateProgress(type, set);
      get().calculateOverallProgress();
    }
  },

  readSingleCert: async (type) => {
    await simulateProgress(type, set);
    get().calculateOverallProgress();
  },

  resetAllCerts: () => {
    set({
      certs: JSON.parse(JSON.stringify(initCerts)),
      overallProgress: 0,
      verifyStatus: 'pending',
      verifyDetails: [],
      compareResults: {},
    });
  },

  setVerifyStatus: (status) => set({ verifyStatus: status }),

  setVerifyDetails: (details) => set({ verifyDetails: details }),

  setCompareResults: (results) => set({ compareResults: results }),

  runVerify: async () => {
    set({ verifyStatus: 'verifying' });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { certs } = get();
    const compareResults: Record<string, { electronic: string; ocr: string; match: boolean }> = {};

    Object.values(certs).forEach((cert) => {
      if (cert.electronicData && cert.ocrData) {
        Object.keys(cert.electronicData).forEach((key) => {
          const fullKey = `${cert.name}-${key}`;
          const electronic = cert.electronicData![key];
          const ocr = cert.ocrData![key] || '';
          compareResults[fullKey] = {
            electronic,
            ocr,
            match: electronic === ocr,
          };
        });
      }
    });

    const hasMismatch = Object.values(compareResults).some((r) => !r.match);
    const allCertsRead = Object.values(certs).every((c) => c.status === 'success');

    const verifyDetails: VerifyDetailItem[] = [
      {
        id: 'v1',
        name: '出生医学证明信息一致性',
        category: '证件一致性',
        status: 'passed',
        message: '电子证照与OCR识别信息完全一致',
      },
      {
        id: 'v2',
        name: '父亲身份证信息一致性',
        category: '证件一致性',
        status: 'passed',
        message: '电子证照与OCR识别信息完全一致',
      },
      {
        id: 'v3',
        name: '母亲身份证信息一致性',
        category: '证件一致性',
        status: hasMismatch ? 'failed' : 'passed',
        message: hasMismatch ? '发现不一致项：姓名、身份证号，请人工核实' : '电子证照与OCR识别信息完全一致',
      },
      {
        id: 'v4',
        name: '结婚证信息一致性',
        category: '证件一致性',
        status: 'passed',
        message: '电子证照与OCR识别信息完全一致',
      },
      {
        id: 'v5',
        name: '证照齐全性检查',
        category: '材料完整性',
        status: allCertsRead ? 'passed' : 'warning',
        message: allCertsRead ? '4份证照已全部读取完成' : '存在未读取的证照',
      },
      {
        id: 'v6',
        name: '亲属关系核验',
        category: '信息有效性',
        status: 'passed',
        message: '结婚证信息与父母身份证信息匹配，亲属关系确认有效',
      },
      {
        id: 'v7',
        name: '身份证有效期核验',
        category: '信息有效性',
        status: 'passed',
        message: '父母身份证均在有效期内',
      },
      {
        id: 'v8',
        name: '出生日期逻辑核验',
        category: '信息有效性',
        status: 'passed',
        message: '新生儿出生日期晚于父母结婚登记日期，逻辑正常',
      },
    ];

    const allPassed = verifyDetails.every((d) => d.status === 'passed');

    set({
      compareResults,
      verifyDetails,
      verifyStatus: allPassed ? 'passed' : 'failed',
    });
  },

  resetVerify: () => {
    set({
      verifyStatus: 'pending',
      verifyDetails: [],
      compareResults: {},
    });
  },
}));
