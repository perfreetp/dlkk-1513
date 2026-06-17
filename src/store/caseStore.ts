import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Dayjs } from 'dayjs';

export type CaseStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'materials_missing';

export type MaterialItem = {
  id: string;
  name: string;
  required: boolean;
  provided: boolean;
};

export interface CaseItem {
  id: string;
  caseNumber: string;
  babyName?: string;
  idCardNumber?: string;
  phone?: string;
  birthDate?: Dayjs | string;
  status: CaseStatus;
  materials: MaterialItem[];
  services: string[];
  queueNumber: string;
  windowNumber?: string;
  createdAt: Dayjs | string;
  updatedAt: Dayjs | string;
  applicantName?: string;
  relation?: string;
  remark?: string;
}

interface CaseState {
  currentCase: CaseItem | null;
  caseList: CaseItem[];
  loading: boolean;

  setCurrentCase: (caseItem: CaseItem | null) => void;
  setCaseList: (list: CaseItem[]) => void;
  addCase: (caseData: Omit<CaseItem, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'status'> & Partial<Pick<CaseItem, 'status'>>) => CaseItem;
  updateCase: (id: string, updates: Partial<CaseItem>) => void;
  updateCaseStatus: (id: string, status: CaseStatus) => void;
  getCaseById: (id: string) => CaseItem | undefined;
  deleteCase: (id: string) => void;
  clearCurrentCase: () => void;
  setLoading: (loading: boolean) => void;
}

const generateCaseNumber = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CS${y}${m}${d}${rand}`;
};

export const useCaseStore = create<CaseState>((set, get) => ({
  currentCase: null,
  caseList: [],
  loading: false,

  setCurrentCase: (caseItem) => set({ currentCase: caseItem }),

  setCaseList: (list) => set({ caseList: list }),

  addCase: (caseData) => {
    const now = new Date().toISOString();
    const newCase: CaseItem = {
      id: uuidv4(),
      caseNumber: generateCaseNumber(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      materials: [],
      services: [],
      queueNumber: '',
      ...caseData,
    };
    set((state) => ({
      caseList: [newCase, ...state.caseList],
      currentCase: newCase,
    }));
    return newCase;
  },

  updateCase: (id, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      caseList: state.caseList.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: now } : c
      ),
      currentCase:
        state.currentCase?.id === id
          ? { ...state.currentCase, ...updates, updatedAt: now }
          : state.currentCase,
    }));
  },

  updateCaseStatus: (id, status) => {
    get().updateCase(id, { status });
  },

  getCaseById: (id) => {
    return get().caseList.find((c) => c.id === id);
  },

  deleteCase: (id) => {
    set((state) => ({
      caseList: state.caseList.filter((c) => c.id !== id),
      currentCase: state.currentCase?.id === id ? null : state.currentCase,
    }));
  },

  clearCurrentCase: () => set({ currentCase: null }),

  setLoading: (loading) => set({ loading }),
}));
