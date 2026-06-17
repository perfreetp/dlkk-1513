import { create } from 'zustand';

export type RegisterType = 'paper' | 'electronic';

export interface PaperRegisterForm {
  boxNo: string;
  location: string;
  binder: string;
  bindDate: string;
}

export interface ElectronicRegisterForm {
  eArchiveNo: string;
  storagePath: string;
  archivist: string;
  archiveDate: string;
}

export type MaterialCategory =
  | '证件类'
  | '证明类'
  | '表单类'
  | '其他';

export interface ArchiveMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  uploadTime: string;
  uploader: string;
  fileSize: string;
  thumbnail: string;
  pages: number;
}

export interface FlowStep {
  id: string;
  key: string;
  title: string;
  icon: string;
  status: 'completed' | 'current' | 'pending';
  operator: string;
  operateTime: string;
  description: string;
}

export interface ELicense {
  id: string;
  type: string;
  licenseNo: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  qrCode: string;
  bound: boolean;
}

interface ArchiveState {
  registerType: RegisterType;
  paperForm: PaperRegisterForm;
  electronicForm: ElectronicRegisterForm;
  materials: ArchiveMaterial[];
  flowSteps: FlowStep[];
  licenses: ELicense[];
  caseNumber: string;
  applicantName: string;
  selectedFlowStepId: string | null;

  setRegisterType: (type: RegisterType) => void;
  setPaperForm: (form: Partial<PaperRegisterForm>) => void;
  setElectronicForm: (form: Partial<ElectronicRegisterForm>) => void;
  addMaterial: (material: Omit<ArchiveMaterial, 'id'>) => void;
  removeMaterial: (id: string) => void;
  setSelectedFlowStepId: (id: string | null) => void;
  toggleLicenseBind: (id: string) => void;
}

const mockPaperForm: PaperRegisterForm = {
  boxNo: '',
  location: '',
  binder: '',
  bindDate: '',
};

const mockElectronicForm: ElectronicRegisterForm = {
  eArchiveNo: '',
  storagePath: '',
  archivist: '',
  archiveDate: '',
};

const mockMaterials: ArchiveMaterial[] = [
  {
    id: 'm1',
    name: '出生医学证明',
    category: '证件类',
    uploadTime: '2026-06-10 09:15:00',
    uploader: '王经办',
    fileSize: '1.2MB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=birth%20certificate%20document%20official%20paper%20chinese%20government%20simple&image_size=square',
    pages: 1,
  },
  {
    id: 'm2',
    name: '户口本本人页',
    category: '证件类',
    uploadTime: '2026-06-10 09:18:00',
    uploader: '王经办',
    fileSize: '856KB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20household%20registration%20hukou%20book%20document%20official&image_size=square',
    pages: 1,
  },
  {
    id: 'm3',
    name: '结婚证',
    category: '证件类',
    uploadTime: '2026-06-10 09:20:00',
    uploader: '王经办',
    fileSize: '1.5MB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20marriage%20certificate%20red%20cover%20official%20document&image_size=square',
    pages: 2,
  },
  {
    id: 'm4',
    name: '身份证正反面',
    category: '证件类',
    uploadTime: '2026-06-10 09:22:00',
    uploader: '王经办',
    fileSize: '768KB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20id%20card%20both%20sides%20official%20identification%20document&image_size=square',
    pages: 2,
  },
  {
    id: 'm5',
    name: '出生登记申请表',
    category: '表单类',
    uploadTime: '2026-06-10 09:25:00',
    uploader: '王经办',
    fileSize: '342KB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=application%20form%20document%20filled%20chinese%20government%20paperwork&image_size=square',
    pages: 3,
  },
  {
    id: 'm6',
    name: '亲属关系证明',
    category: '证明类',
    uploadTime: '2026-06-10 09:28:00',
    uploader: '王经办',
    fileSize: '512KB',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=family%20relationship%20certificate%20official%20document%20chinese&image_size=square',
    pages: 1,
  },
];

const mockFlowSteps: FlowStep[] = [
  {
    id: 'f1',
    key: 'call',
    title: '叫号',
    icon: 'BellRing',
    status: 'completed',
    operator: '系统',
    operateTime: '2026-06-10 09:00:00',
    description: '取号成功，号码A023，等待叫号办理',
  },
  {
    id: 'f2',
    key: 'create',
    title: '建单',
    icon: 'FilePlus2',
    status: 'completed',
    operator: '王经办',
    operateTime: '2026-06-10 09:05:00',
    description: '创建办件单，关联申请人信息及办理事项',
  },
  {
    id: 'f3',
    key: 'verify',
    title: '核验',
    icon: 'ClipboardCheck',
    status: 'completed',
    operator: '王经办',
    operateTime: '2026-06-10 09:30:00',
    description: '材料核验通过，信息比对无误',
  },
  {
    id: 'f4',
    key: 'joint',
    title: '联办',
    icon: 'Share2',
    status: 'completed',
    operator: '多部门',
    operateTime: '2026-06-10 10:00:00',
    description: '公安、医保、社保等部门并联审批完成',
  },
  {
    id: 'f5',
    key: 'approve',
    title: '审批',
    icon: 'BadgeCheck',
    status: 'completed',
    operator: '李主管',
    operateTime: '2026-06-10 11:00:00',
    description: '全部事项审批通过，生成办理结果',
  },
  {
    id: 'f6',
    key: 'complete',
    title: '办结',
    icon: 'CheckCircle2',
    status: 'current',
    operator: '系统',
    operateTime: '2026-06-10 14:00:00',
    description: '办件已办结，等待归档处理',
  },
  {
    id: 'f7',
    key: 'archive',
    title: '归档',
    icon: 'Archive',
    status: 'pending',
    operator: '-',
    operateTime: '-',
    description: '材料整理归档，完成全流程',
  },
];

const mockLicenses: ELicense[] = [
  {
    id: 'l1',
    type: '出生医学证明',
    licenseNo: 'J3101012026001234',
    issuer: '上海市第一妇婴保健院',
    validFrom: '2026-06-01',
    validTo: '长期有效',
    qrCode: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=QR%20code%20simple%20black%20white%20square%20matrix%20barcode&image_size=square',
    bound: true,
  },
  {
    id: 'l2',
    type: '户口本页',
    licenseNo: '沪310101000012345678',
    issuer: '上海市公安局黄浦分局',
    validFrom: '2026-06-10',
    validTo: '长期有效',
    qrCode: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=QR%20code%20simple%20black%20white%20square%20matrix%20barcode%20second&image_size=square',
    bound: true,
  },
  {
    id: 'l3',
    type: '社保卡',
    licenseNo: '31010120260601001',
    issuer: '上海市人力资源和社会保障局',
    validFrom: '2026-06-15',
    validTo: '2036-06-15',
    qrCode: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=QR%20code%20simple%20black%20white%20square%20matrix%20barcode%20third&image_size=square',
    bound: false,
  },
  {
    id: 'l4',
    type: '医保凭证',
    licenseNo: 'YB2026060100123',
    issuer: '上海市医疗保障局',
    validFrom: '2026-06-15',
    validTo: '长期有效',
    qrCode: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=QR%20code%20simple%20black%20white%20square%20matrix%20barcode%20fourth&image_size=square',
    bound: false,
  },
];

export const useArchiveStore = create<ArchiveState>((set) => ({
  registerType: 'paper',
  paperForm: mockPaperForm,
  electronicForm: mockElectronicForm,
  materials: mockMaterials,
  flowSteps: mockFlowSteps,
  licenses: mockLicenses,
  caseNumber: 'CS202606101234',
  applicantName: '刘女士',
  selectedFlowStepId: null,

  setRegisterType: (type) => set({ registerType: type }),
  setPaperForm: (form) =>
    set((state) => ({ paperForm: { ...state.paperForm, ...form } })),
  setElectronicForm: (form) =>
    set((state) => ({ electronicForm: { ...state.electronicForm, ...form } })),
  addMaterial: (material) =>
    set((state) => ({
      materials: [
        ...state.materials,
        { ...material, id: `m${Date.now()}` },
      ],
    })),
  removeMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
    })),
  setSelectedFlowStepId: (id) => set({ selectedFlowStepId: id }),
  toggleLicenseBind: (id) =>
    set((state) => ({
      licenses: state.licenses.map((l) =>
        l.id === id ? { ...l, bound: !l.bound } : l
      ),
    })),
}));
