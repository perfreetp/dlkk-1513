import { create } from 'zustand';

export type DepartmentType = '公安' | '人社' | '医保' | '卫健';

export type SceneCategory =
  | '热门情形'
  | '全办组合'
  | '公安类'
  | '人社类'
  | '医保类'
  | '卫健类';

export interface SceneCard {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  icon: string;
  category: SceneCategory;
  defaultItemIds: string[];
  popular?: boolean;
}

export interface ComboItem {
  id: string;
  name: string;
  department: DepartmentType;
  timeLimit: string;
  materialCount: number;
  description: string;
  required?: boolean;
}

export interface ApplicantInfo {
  name: string;
  idCardNo: string;
  phone: string;
  address: string;
  babyName: string;
  babyGender: '男' | '女';
  babyBirthDate: string;
}

export interface DepartmentContact {
  department: DepartmentType;
  phone: string;
  address: string;
}

export interface NoticeData {
  noticeNo: string;
  issueDate: string;
  applicant: ApplicantInfo;
  items: ComboItem[];
  materials: { name: string; count: number; remark?: string }[];
  timeLimitDesc: string;
  contacts: DepartmentContact[];
}

export interface DraftData {
  activeCategory: SceneCategory;
  selectedSceneId: string | null;
  selectedItemIds: string[];
  applicant: ApplicantInfo;
  noticeData: NoticeData;
  savedAt: string;
}

interface ComboArrangeState {
  activeCategory: SceneCategory;
  selectedSceneId: string | null;
  selectedItemIds: string[];
  sceneList: SceneCard[];
  itemList: ComboItem[];
  applicant: ApplicantInfo;
  noticeData: NoticeData;
  countdownTotalSeconds: number;
  countdownRemaining: number;
  isCountdownRunning: boolean;
  hasDraft: boolean;
  draftSavedAt: string | null;

  setActiveCategory: (category: SceneCategory) => void;
  setSelectedSceneId: (id: string | null) => void;
  toggleItem: (itemId: string) => void;
  selectScene: (sceneId: string) => void;
  clearAllItems: () => void;
  selectAllItems: () => void;
  setApplicant: (info: Partial<ApplicantInfo>) => void;
  setCountdownTotal: (seconds: number) => void;
  tickCountdown: () => void;
  startCountdown: () => void;
  pauseCountdown: () => void;
  resetCountdown: () => void;
  saveDraft: () => void;
  loadDraft: () => boolean;
  clearDraft: () => void;
}

const MOCK_SCENES: SceneCard[] = [
  {
    id: 'scene-1',
    title: '出生登记+医保+社保联办',
    description: '新生儿出生后一次性办理户口登记、医保参保和社保相关业务',
    itemCount: 5,
    icon: 'Baby',
    category: '热门情形',
    defaultItemIds: ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'],
    popular: true,
  },
  {
    id: 'scene-2',
    title: '出生登记+预防接种',
    description: '户口登记与预防接种证联动办理',
    itemCount: 2,
    icon: 'ClipboardList',
    category: '热门情形',
    defaultItemIds: ['item-1', 'item-4'],
    popular: true,
  },
  {
    id: 'scene-3',
    title: '全办组合（5项联办）',
    description: '出生登记、社保卡、医保参保、预防接种、生育待遇全部联办',
    itemCount: 5,
    icon: 'Layers',
    category: '全办组合',
    defaultItemIds: ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'],
  },
  {
    id: 'scene-4',
    title: '出生登记（户口申报）',
    description: '仅办理新生儿出生登记户口申报',
    itemCount: 1,
    icon: 'FileText',
    category: '公安类',
    defaultItemIds: ['item-1'],
  },
  {
    id: 'scene-5',
    title: '社保卡申领',
    description: '为新生儿办理社会保障卡申领',
    itemCount: 1,
    icon: 'CreditCard',
    category: '人社类',
    defaultItemIds: ['item-2'],
  },
  {
    id: 'scene-6',
    title: '医保参保登记',
    description: '办理新生儿城乡居民医疗保险参保登记',
    itemCount: 1,
    icon: 'HeartPulse',
    category: '医保类',
    defaultItemIds: ['item-3'],
  },
  {
    id: 'scene-7',
    title: '预防接种证办理',
    description: '办理儿童预防接种证',
    itemCount: 1,
    icon: 'Syringe',
    category: '卫健类',
    defaultItemIds: ['item-4'],
  },
  {
    id: 'scene-8',
    title: '生育待遇申领',
    description: '申领生育保险相关待遇',
    itemCount: 1,
    icon: 'Gift',
    category: '医保类',
    defaultItemIds: ['item-5'],
  },
  {
    id: 'scene-9',
    title: '医保+社保二联办',
    description: '医保参保和社保卡联动办理',
    itemCount: 2,
    icon: 'ShieldPlus',
    category: '热门情形',
    defaultItemIds: ['item-2', 'item-3'],
    popular: true,
  },
];

const MOCK_ITEMS: ComboItem[] = [
  {
    id: 'item-1',
    name: '出生登记-公安',
    department: '公安',
    timeLimit: '当场办结',
    materialCount: 5,
    description: '新生儿出生户口登记申报，由公安机关户籍部门办理',
    required: true,
  },
  {
    id: 'item-2',
    name: '社保卡-人社',
    department: '人社',
    timeLimit: '30个工作日',
    materialCount: 3,
    description: '社会保障卡申领，由人力资源和社会保障部门办理',
  },
  {
    id: 'item-3',
    name: '医保参保-医保',
    department: '医保',
    timeLimit: '当场办结',
    materialCount: 4,
    description: '城乡居民基本医疗保险参保登记',
  },
  {
    id: 'item-4',
    name: '预防接种证-卫健',
    department: '卫健',
    timeLimit: '当场办结',
    materialCount: 2,
    description: '儿童预防接种证办理，由卫生健康部门发放',
  },
  {
    id: 'item-5',
    name: '生育待遇-医保',
    department: '医保',
    timeLimit: '15个工作日',
    materialCount: 6,
    description: '生育保险待遇申领，含生育医疗费用报销和生育津贴',
  },
];

const MOCK_APPLICANT: ApplicantInfo = {
  name: '张建国',
  idCardNo: '330102199001011234',
  phone: '13812345678',
  address: '浙江省杭州市西湖区文三路100号1栋2单元301室',
  babyName: '张小明',
  babyGender: '男',
  babyBirthDate: '2026-06-10',
};

const MOCK_NOTICE_DATA: NoticeData = {
  noticeNo: 'CS-2026-0618-001234',
  issueDate: '2026-06-18',
  applicant: MOCK_APPLICANT,
  items: MOCK_ITEMS,
  materials: [
    { name: '出生医学证明', count: 1, remark: '原件+复印件' },
    { name: '父母双方居民身份证', count: 2, remark: '原件+复印件' },
    { name: '父母双方户口簿', count: 2, remark: '原件+复印件' },
    { name: '结婚证', count: 1, remark: '原件+复印件' },
    { name: '新生儿血型化验单', count: 1 },
    { name: '房产证/购房合同', count: 1, remark: '复印件' },
    { name: '银行卡', count: 1, remark: '一类借记卡复印件' },
  ],
  timeLimitDesc:
    '本联办事项涉及多部门协同办理，整体办结时限为自受理之日起30个工作日。其中：出生登记、医保参保、预防接种证当场办结；社保卡30个工作日内邮寄送达；生育待遇15个工作日内完成审核拨付。',
  contacts: [
    { department: '公安', phone: '0571-87001234', address: '杭州市公安局西湖分局户籍窗口' },
    { department: '人社', phone: '0571-87005678', address: '西湖区行政服务中心人社窗口' },
    { department: '医保', phone: '0571-87009012', address: '西湖区行政服务中心医保窗口' },
    { department: '卫健', phone: '0571-87003456', address: '西湖区社区卫生服务中心接种门诊' },
  ],
};

const DRAFT_STORAGE_KEY = 'combo_arrange_draft';

const getInitialDraftState = () => {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        hasDraft: true,
        draftSavedAt: data.savedAt,
      };
    }
  } catch {
    // ignore
  }
  return { hasDraft: false, draftSavedAt: null };
};

export const useComboArrangeStore = create<ComboArrangeState>((set, get) => ({
  activeCategory: '热门情形',
  selectedSceneId: null,
  selectedItemIds: [],
  sceneList: MOCK_SCENES,
  itemList: MOCK_ITEMS,
  applicant: MOCK_APPLICANT,
  noticeData: MOCK_NOTICE_DATA,
  countdownTotalSeconds: 20 * 60,
  countdownRemaining: 20 * 60,
  isCountdownRunning: false,
  ...getInitialDraftState(),

  setActiveCategory: (category) => set({ activeCategory: category }),

  setSelectedSceneId: (id) => set({ selectedSceneId: id }),

  toggleItem: (itemId) => {
    const { selectedItemIds } = get();
    const item = get().itemList.find((i) => i.id === itemId);
    if (item?.required && selectedItemIds.includes(itemId)) return;
    set({
      selectedItemIds: selectedItemIds.includes(itemId)
        ? selectedItemIds.filter((id) => id !== itemId)
        : [...selectedItemIds, itemId],
    });
  },

  selectScene: (sceneId) => {
    const scene = get().sceneList.find((s) => s.id === sceneId);
    if (scene) {
      const requiredIds = get()
        .itemList.filter((i) => i.required)
        .map((i) => i.id);
      const mergedIds = Array.from(new Set([...scene.defaultItemIds, ...requiredIds]));
      set({
        selectedSceneId: sceneId,
        selectedItemIds: mergedIds,
      });
    }
  },

  clearAllItems: () => {
    const requiredIds = get()
      .itemList.filter((i) => i.required)
      .map((i) => i.id);
    set({ selectedItemIds: requiredIds, selectedSceneId: null });
  },

  selectAllItems: () => {
    const allIds = get().itemList.map((i) => i.id);
    set({ selectedItemIds: allIds });
  },

  setApplicant: (info) => {
    set((state) => ({
      applicant: { ...state.applicant, ...info },
      noticeData: { ...state.noticeData, applicant: { ...state.applicant, ...info } },
    }));
  },

  setCountdownTotal: (seconds) => {
    set({ countdownTotalSeconds: seconds, countdownRemaining: seconds });
  },

  tickCountdown: () => {
    set((state) => ({
      countdownRemaining: Math.max(0, state.countdownRemaining - 1),
    }));
  },

  startCountdown: () => set({ isCountdownRunning: true }),
  pauseCountdown: () => set({ isCountdownRunning: false }),
  resetCountdown: () =>
    set((state) => ({
      countdownRemaining: state.countdownTotalSeconds,
      isCountdownRunning: false,
    })),

  saveDraft: () => {
    const state = get();
    const draft: DraftData = {
      activeCategory: state.activeCategory,
      selectedSceneId: state.selectedSceneId,
      selectedItemIds: state.selectedItemIds,
      applicant: state.applicant,
      noticeData: state.noticeData,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      set({ hasDraft: true, draftSavedAt: draft.savedAt });
    } catch {
      // ignore
    }
  },

  loadDraft: () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return false;
      const draft: DraftData = JSON.parse(saved);
      set({
        activeCategory: draft.activeCategory,
        selectedSceneId: draft.selectedSceneId,
        selectedItemIds: draft.selectedItemIds,
        applicant: draft.applicant,
        noticeData: draft.noticeData,
        hasDraft: true,
        draftSavedAt: draft.savedAt,
      });
      return true;
    } catch {
      return false;
    }
  },

  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      set({ hasDraft: false, draftSavedAt: null });
    } catch {
      // ignore
    }
  },
}));
