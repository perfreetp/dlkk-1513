import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { supplementScriptList, type SupplementScript } from '@/data/libraries/supplementScripts';

export type PriorityLevel = '高' | '中' | '低';

export interface SupplementItem {
  id: string;
  materialName: string;
  priority: PriorityLevel;
  requirement: string;
  deadline: string;
  scriptId?: string;
  inserted: boolean;
}

export interface NoticeContent {
  caseNo: string;
  caseDate: string;
  applicantName: string;
  applicantIdCard: string;
  applicantPhone: string;
  caseType: string;
  mainContent: string;
  supplements: SupplementItem[];
  issueDate: string;
  issueOffice: string;
  contactPerson: string;
  contactPhone: string;
}

interface SupplementState {
  scriptList: SupplementScript[];
  activeScriptCategory: SupplementScript['category'] | 'all';
  searchKeyword: string;
  expandedPanels: string[];

  supplementList: SupplementItem[];

  noticeContent: NoticeContent;

  setActiveScriptCategory: (category: SupplementScript['category'] | 'all') => void;
  setSearchKeyword: (keyword: string) => void;
  togglePanel: (panel: string) => void;
  expandAllPanels: () => void;
  collapseAllPanels: () => void;

  addSupplementItem: (item?: Partial<SupplementItem>) => void;
  removeSupplementItem: (id: string) => void;
  updateSupplementItem: (id: string, updates: Partial<SupplementItem>) => void;
  clearSupplementList: () => void;
  insertScriptToSupplement: (scriptId: string) => void;

  setNoticeContent: (updates: Partial<NoticeContent>) => void;
  updateNoticeMainContent: (content: string) => void;
  generateNoticeFromList: () => void;
  printNotice: () => void;

  getFilteredScripts: () => SupplementScript[];
}

const MOCK_SUPPLEMENT_ITEMS: SupplementItem[] = [
  {
    id: 'supp-1',
    materialName: '父母双方居民身份证',
    priority: '高',
    requirement: '提供清晰的正反面复印件，确保姓名、证件号码、照片等关键信息完整可辨',
    deadline: '2026-06-25',
    scriptId: 'script-cert-002',
    inserted: false,
  },
  {
    id: 'supp-2',
    materialName: '新生儿出生医学证明',
    priority: '高',
    requirement: '请携带《出生医学证明》原件前来办理，原件核验后将返还，复印件用于存档',
    deadline: '2026-06-25',
    scriptId: 'script-cert-003',
    inserted: false,
  },
  {
    id: 'supp-3',
    materialName: '户口簿相关页面',
    priority: '中',
    requirement: '补充完整户口簿的户主页、本人页、增减页复印件',
    deadline: '2026-06-28',
    scriptId: 'script-cert-006',
    inserted: false,
  },
];

const MOCK_NOTICE_CONTENT: NoticeContent = {
  caseNo: 'CS-2026-0618-001234',
  caseDate: '2026-06-18',
  applicantName: '张建国',
  applicantIdCard: '330102199001011234',
  applicantPhone: '13812345678',
  caseType: '出生一件事联办',
  mainContent: '',
  supplements: MOCK_SUPPLEMENT_ITEMS,
  issueDate: '2026-06-18',
  issueOffice: '西湖区政务服务中心综合受理窗口',
  contactPerson: '李办事员',
  contactPhone: '0571-87001234',
};

export const useSupplementStore = create<SupplementState>((set, get) => ({
  scriptList: supplementScriptList,
  activeScriptCategory: 'all',
  searchKeyword: '',
  expandedPanels: ['证件类'],

  supplementList: MOCK_SUPPLEMENT_ITEMS,

  noticeContent: MOCK_NOTICE_CONTENT,

  setActiveScriptCategory: (category) => set({ activeScriptCategory: category }),

  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  togglePanel: (panel) => {
    set((state) => ({
      expandedPanels: state.expandedPanels.includes(panel)
        ? state.expandedPanels.filter((p) => p !== panel)
        : [...state.expandedPanels, panel],
    }));
  },

  expandAllPanels: () => {
    set({ expandedPanels: ['证件类', '材料类', '信息类'] });
  },

  collapseAllPanels: () => {
    set({ expandedPanels: [] });
  },

  addSupplementItem: (item) => {
    const newItem: SupplementItem = {
      id: uuidv4(),
      materialName: '',
      priority: '中',
      requirement: '',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      inserted: false,
      ...item,
    };
    set((state) => ({
      supplementList: [...state.supplementList, newItem],
      noticeContent: {
        ...state.noticeContent,
        supplements: [...state.noticeContent.supplements, newItem],
      },
    }));
  },

  removeSupplementItem: (id) => {
    set((state) => ({
      supplementList: state.supplementList.filter((i) => i.id !== id),
      noticeContent: {
        ...state.noticeContent,
        supplements: state.noticeContent.supplements.filter((i) => i.id !== id),
      },
    }));
  },

  updateSupplementItem: (id, updates) => {
    set((state) => ({
      supplementList: state.supplementList.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
      noticeContent: {
        ...state.noticeContent,
        supplements: state.noticeContent.supplements.map((i) =>
          i.id === id ? { ...i, ...updates } : i
        ),
      },
    }));
  },

  clearSupplementList: () => {
    set({
      supplementList: [],
      noticeContent: { ...get().noticeContent, supplements: [] },
    });
  },

  insertScriptToSupplement: (scriptId) => {
    const script = get().scriptList.find((s) => s.id === scriptId);
    if (!script) return;

    const newItem: SupplementItem = {
      id: uuidv4(),
      materialName: script.title,
      priority: script.urgency === 'urgent' ? '高' : '中',
      requirement: script.content.replace(/\{[^}]+\}/g, '【待补充】'),
      deadline: new Date(
        Date.now() + script.defaultDeadlineDays * 24 * 60 * 60 * 1000
      ).toISOString().slice(0, 10),
      scriptId,
      inserted: true,
    };

    set((state) => ({
      supplementList: [...state.supplementList, newItem],
      noticeContent: {
        ...state.noticeContent,
        supplements: [...state.noticeContent.supplements, newItem],
      },
    }));
  },

  setNoticeContent: (updates) => {
    set((state) => ({
      noticeContent: { ...state.noticeContent, ...updates },
    }));
  },

  updateNoticeMainContent: (content) => {
    set((state) => ({
      noticeContent: { ...state.noticeContent, mainContent: content },
    }));
  },

  generateNoticeFromList: () => {
    const { supplementList, noticeContent } = get();
    const urgencyMap: Record<PriorityLevel, string> = { 高: '【紧急】', 中: '', 低: '【普通】' };
    const content = supplementList
      .map(
        (item, idx) =>
          `${idx + 1}. ${urgencyMap[item.priority]}${item.materialName}：${item.requirement}（截止日期：${item.deadline}）`
      )
      .join('\n\n');
    set({
      noticeContent: { ...noticeContent, mainContent: content },
    });
  },

  printNotice: () => {
    window.print();
  },

  getFilteredScripts: () => {
    const { scriptList, activeScriptCategory, searchKeyword } = get();
    let result = scriptList.filter((s) => s.enabled);
    if (activeScriptCategory !== 'all') {
      result = result.filter((s) => s.category === activeScriptCategory);
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(kw) ||
          s.content.toLowerCase().includes(kw) ||
          s.code.toLowerCase().includes(kw) ||
          (s.subCategory?.toLowerCase() ?? '').includes(kw)
      );
    }
    return result;
  },
}));
