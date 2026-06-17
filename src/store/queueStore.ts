import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type QueueStatus = 'waiting' | 'calling' | 'serving' | 'completed' | 'missed';

export interface QueueItem {
  id: string;
  number: string;
  caseId?: string;
  applicantName?: string;
  phone?: string;
  serviceType: string;
  priority: boolean;
  status: QueueStatus;
  windowNumber?: string;
  arrivalTime: string;
  calledTime?: string;
  servedTime?: string;
  completedTime?: string;
  callCount: number;
}

interface QueueState {
  queueList: QueueItem[];
  currentCalling: QueueItem | null;
  currentServing: QueueItem | null;
  currentWindow: string;
  lastCalledNumber: string | null;
  autoPlayVoice: boolean;

  setQueueList: (list: QueueItem[]) => void;
  addToQueue: (item: Omit<QueueItem, 'id' | 'arrivalTime' | 'status' | 'callCount'> & Partial<Pick<QueueItem, 'status'>>) => QueueItem;
  removeFromQueue: (id: string) => void;
  callNext: (windowNumber?: string) => QueueItem | null;
  recall: (id: string) => void;
  markAsServing: (id: string, windowNumber?: string) => void;
  markAsCompleted: (id: string) => void;
  markAsMissed: (id: string) => void;
  setCurrentCalling: (item: QueueItem | null) => void;
  setCurrentServing: (item: QueueItem | null) => void;
  setCurrentWindow: (window: string) => void;
  setAutoPlayVoice: (enabled: boolean) => void;
  getWaitingCount: () => number;
  getNextWaiting: () => QueueItem | undefined;
  clearQueue: () => void;
}

const generateQueueNumber = (): string => {
  const prefix = 'A';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${rand}`;
};

export const useQueueStore = create<QueueState>((set, get) => ({
  queueList: [],
  currentCalling: null,
  currentServing: null,
  currentWindow: '',
  lastCalledNumber: null,
  autoPlayVoice: true,

  setQueueList: (list) => set({ queueList: list }),

  addToQueue: (item) => {
    const newItem: QueueItem = {
      id: uuidv4(),
      number: generateQueueNumber(),
      arrivalTime: new Date().toISOString(),
      status: 'waiting',
      callCount: 0,
      ...item,
    };
    set((state) => ({
      queueList: [...state.queueList, newItem],
    }));
    return newItem;
  },

  removeFromQueue: (id) => {
    set((state) => ({
      queueList: state.queueList.filter((q) => q.id !== id),
    }));
  },

  callNext: (windowNumber) => {
    const state = get();
    const win = windowNumber || state.currentWindow;
    const next = state.queueList
      .filter((q) => q.status === 'waiting')
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority ? 1 : -1;
        return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
      })[0];

    if (!next) return null;

    const now = new Date().toISOString();
    const updated: QueueItem = {
      ...next,
      status: 'calling',
      windowNumber: win,
      calledTime: now,
      callCount: next.callCount + 1,
    };

    set((s) => ({
      queueList: s.queueList.map((q) => (q.id === next.id ? updated : q)),
      currentCalling: updated,
      lastCalledNumber: updated.number,
    }));

    return updated;
  },

  recall: (id) => {
    const now = new Date().toISOString();
    set((state) => {
      const item = state.queueList.find((q) => q.id === id);
      if (!item) return state;
      const updated: QueueItem = {
        ...item,
        status: 'calling',
        calledTime: now,
        callCount: item.callCount + 1,
        windowNumber: state.currentWindow || item.windowNumber,
      };
      return {
        queueList: state.queueList.map((q) => (q.id === id ? updated : q)),
        currentCalling: updated,
      };
    });
  },

  markAsServing: (id, windowNumber) => {
    const now = new Date().toISOString();
    set((state) => {
      const item = state.queueList.find((q) => q.id === id);
      if (!item) return state;
      const updated: QueueItem = {
        ...item,
        status: 'serving',
        servedTime: now,
        windowNumber: windowNumber || state.currentWindow || item.windowNumber,
      };
      return {
        queueList: state.queueList.map((q) => (q.id === id ? updated : q)),
        currentCalling: state.currentCalling?.id === id ? null : state.currentCalling,
        currentServing: updated,
      };
    });
  },

  markAsCompleted: (id) => {
    const now = new Date().toISOString();
    set((state) => {
      const updated: QueueItem = {
        ...(state.queueList.find((q) => q.id === id) || ({} as QueueItem)),
        status: 'completed',
        completedTime: now,
      };
      return {
        queueList: state.queueList.map((q) => (q.id === id ? updated : q)),
        currentServing: state.currentServing?.id === id ? null : state.currentServing,
      };
    });
  },

  markAsMissed: (id) => {
    set((state) => {
      const updated: QueueItem = {
        ...(state.queueList.find((q) => q.id === id) || ({} as QueueItem)),
        status: 'missed',
      };
      return {
        queueList: state.queueList.map((q) => (q.id === id ? updated : q)),
        currentCalling: state.currentCalling?.id === id ? null : state.currentCalling,
      };
    });
  },

  setCurrentCalling: (item) => set({ currentCalling: item }),

  setCurrentServing: (item) => set({ currentServing: item }),

  setCurrentWindow: (window) => set({ currentWindow: window }),

  setAutoPlayVoice: (enabled) => set({ autoPlayVoice: enabled }),

  getWaitingCount: () => {
    return get().queueList.filter((q) => q.status === 'waiting').length;
  },

  getNextWaiting: () => {
    return get()
      .queueList.filter((q) => q.status === 'waiting')
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority ? 1 : -1;
        return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
      })[0];
  },

  clearQueue: () => {
    set({
      queueList: [],
      currentCalling: null,
      currentServing: null,
      lastCalledNumber: null,
    });
  },
}));
