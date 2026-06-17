import { create } from 'zustand';

export type ExceptionCategory =
  | 'material'
  | 'info'
  | 'qualification'
  | 'system'
  | 'business'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ExceptionType {
  id: string;
  key: ExceptionCategory;
  name: string;
  icon: string;
  severity: SeverityLevel;
  description: string;
  returnCount: number;
}

export interface ReasonTemplate {
  id: string;
  category: ExceptionCategory;
  title: string;
  content: string;
  useCount: number;
  lastUsedAt: string;
}

export interface ReviewRecord {
  id: string;
  reviewType: string;
  reviewer: string;
  reviewTime: string;
  opinion: string;
  attachments: string[];
  result: 'passed' | 'rejected';
}

export interface TimelineNode {
  id: string;
  node: string;
  operator: string;
  operateTime: string;
  status: 'completed' | 'current' | 'pending';
  remark?: string;
}

interface ExceptionReturnState {
  selectedExceptionType: ExceptionCategory | null;
  selectedTemplateId: string | null;
  customRemark: string;
  reviewForm: {
    reviewType: string;
    reviewer: string;
    opinion: string;
    attachments: string[];
  };
  exceptionTypes: ExceptionType[];
  reasonTemplates: ReasonTemplate[];
  reviewHistory: ReviewRecord[];
  timeline: TimelineNode[];
  caseNumber: string;
  applicantName: string;

  setSelectedExceptionType: (type: ExceptionCategory | null) => void;
  setSelectedTemplateId: (id: string | null) => void;
  setCustomRemark: (remark: string) => void;
  setReviewForm: (form: Partial<ExceptionReturnState['reviewForm']>) => void;
  resetReviewForm: () => void;
  addReviewRecord: (record: Omit<ReviewRecord, 'id' | 'reviewTime'>) => void;
  addAttachment: (file: string) => void;
  removeAttachment: (index: number) => void;
}

const mockExceptionTypes: ExceptionType[] = [
  {
    id: '1',
    key: 'material',
    name: '材料异常',
    icon: 'FileX2',
    severity: 'high',
    description: '申请材料缺失、不完整或不符合规范',
    returnCount: 128,
  },
  {
    id: '2',
    key: 'info',
    name: '信息异常',
    icon: 'AlertCircle',
    severity: 'medium',
    description: '申请人填写信息有误或不一致',
    returnCount: 86,
  },
  {
    id: '3',
    key: 'qualification',
    name: '资格异常',
    icon: 'ShieldAlert',
    severity: 'critical',
    description: '申请人不具备办理资格或条件',
    returnCount: 42,
  },
  {
    id: '4',
    key: 'system',
    name: '系统异常',
    icon: 'ServerCrash',
    severity: 'medium',
    description: '业务系统故障或数据同步异常',
    returnCount: 18,
  },
  {
    id: '5',
    key: 'business',
    name: '业务异常',
    icon: 'BriefcaseAlert',
    severity: 'high',
    description: '业务流程冲突或政策规则变更',
    returnCount: 35,
  },
  {
    id: '6',
    key: 'other',
    name: '其他异常',
    icon: 'HelpCircle',
    severity: 'low',
    description: '其他未分类的异常情况',
    returnCount: 15,
  },
];

const mockReasonTemplates: ReasonTemplate[] = [
  {
    id: 't1',
    category: 'material',
    title: '出生医学证明原件缺失',
    content: '请提供出生医学证明原件，当前提交的复印件无法核验真实性。',
    useCount: 56,
    lastUsedAt: '2026-06-15 14:30',
  },
  {
    id: 't2',
    category: 'material',
    title: '户口本首页及本人页未提供',
    content: '请补充提供户口本首页（户主页）及本人常住人口登记卡。',
    useCount: 42,
    lastUsedAt: '2026-06-16 09:15',
  },
  {
    id: 't3',
    category: 'info',
    title: '身份证号码填写错误',
    content: '申请人身份证号码位数不正确或校验位错误，请核对后重新填写。',
    useCount: 38,
    lastUsedAt: '2026-06-17 11:20',
  },
  {
    id: 't4',
    category: 'material',
    title: '结婚证照片模糊不清',
    content: '结婚证扫描件关键信息模糊，无法辨认，请重新扫描上传清晰版本。',
    useCount: 29,
    lastUsedAt: '2026-06-14 16:45',
  },
  {
    id: 't5',
    category: 'qualification',
    title: '父母一方未满法定婚龄',
    content: '经核查，父母一方登记结婚时未达到法定婚龄，需提供补充说明材料。',
    useCount: 22,
    lastUsedAt: '2026-06-13 10:00',
  },
  {
    id: 't6',
    category: 'info',
    title: '联系电话为空或无效',
    content: '申请人联系电话未填写或格式不正确，请提供有效的手机号码。',
    useCount: 19,
    lastUsedAt: '2026-06-17 15:30',
  },
  {
    id: 't7',
    category: 'business',
    title: '业务场景选择不当',
    content: '根据实际情况，当前业务场景选择有误，请选择正确的办理场景后重新提交。',
    useCount: 15,
    lastUsedAt: '2026-06-16 14:10',
  },
  {
    id: 't8',
    category: 'system',
    title: '公安系统数据同步延迟',
    content: '因公安人口信息系统数据同步延迟，暂时无法核验身份信息，请稍后重试。',
    useCount: 8,
    lastUsedAt: '2026-06-12 09:30',
  },
];

const mockReviewHistory: ReviewRecord[] = [
  {
    id: 'r1',
    reviewType: '一级复核',
    reviewer: '张审核',
    reviewTime: '2026-06-10 10:30:00',
    opinion: '材料确实缺失出生医学证明原件，同意退回。',
    attachments: ['审核意见单.pdf'],
    result: 'passed',
  },
  {
    id: 'r2',
    reviewType: '二级复核',
    reviewer: '李主管',
    reviewTime: '2026-06-10 11:15:00',
    opinion: '符合退件条件，已通知申请人补正材料。',
    attachments: ['退件通知书.pdf'],
    result: 'passed',
  },
];

const mockTimeline: TimelineNode[] = [
  {
    id: 'n1',
    node: '提交退回',
    operator: '王经办',
    operateTime: '2026-06-10 09:30:00',
    status: 'completed',
    remark: '发现材料缺失，发起退件申请',
  },
  {
    id: 'n2',
    node: '部门审核',
    operator: '张审核',
    operateTime: '2026-06-10 10:30:00',
    status: 'completed',
    remark: '审核通过，同意退件',
  },
  {
    id: 'n3',
    node: '复核确认',
    operator: '李主管',
    operateTime: '2026-06-10 11:15:00',
    status: 'completed',
    remark: '复核确认，已生成退件通知书',
  },
  {
    id: 'n4',
    node: '群众补正',
    operator: '申请人（刘女士）',
    operateTime: '-',
    status: 'current',
    remark: '等待申请人补充材料',
  },
  {
    id: 'n5',
    node: '重新受理',
    operator: '-',
    operateTime: '-',
    status: 'pending',
    remark: '材料补正完成后重新受理',
  },
];

export const useExceptionReturnStore = create<ExceptionReturnState>((set) => ({
  selectedExceptionType: null,
  selectedTemplateId: null,
  customRemark: '',
  reviewForm: {
    reviewType: '',
    reviewer: '',
    opinion: '',
    attachments: [],
  },
  exceptionTypes: mockExceptionTypes,
  reasonTemplates: mockReasonTemplates,
  reviewHistory: mockReviewHistory,
  timeline: mockTimeline,
  caseNumber: 'CS202606101234',
  applicantName: '刘女士',

  setSelectedExceptionType: (type) => set({ selectedExceptionType: type }),
  setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
  setCustomRemark: (remark) => set({ customRemark: remark }),
  setReviewForm: (form) =>
    set((state) => ({
      reviewForm: { ...state.reviewForm, ...form },
    })),
  resetReviewForm: () =>
    set({
      reviewForm: {
        reviewType: '',
        reviewer: '',
        opinion: '',
        attachments: [],
      },
    }),
  addReviewRecord: (record) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    set((state) => ({
      reviewHistory: [
        {
          ...record,
          id: `r${Date.now()}`,
          reviewTime: timeStr,
        },
        ...state.reviewHistory,
      ],
    }));
  },
  addAttachment: (file) =>
    set((state) => ({
      reviewForm: {
        ...state.reviewForm,
        attachments: [...state.reviewForm.attachments, file],
      },
    })),
  removeAttachment: (index) =>
    set((state) => ({
      reviewForm: {
        ...state.reviewForm,
        attachments: state.reviewForm.attachments.filter((_, i) => i !== index),
      },
    })),
}));
