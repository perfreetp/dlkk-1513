import { create } from 'zustand';

export type UserRole = 'admin' | 'clerk' | 'supervisor' | 'reviewer';

export interface UserInfo {
  id: string;
  username: string;
  realName: string;
  avatar?: string;
  role: UserRole;
  windowNumber: string;
  department: string;
  phone: string;
  permissions: string[];
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;

  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUser: (user: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  setWindowNumber: (windowNumber: string) => void;
  setRole: (role: UserRole) => void;
  updateUser: (updates: Partial<UserInfo>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  setLoading: (loading: boolean) => void;
  restoreSession: () => void;
}

const MOCK_USERS: Record<string, UserInfo & { password: string }> = {
  admin: {
    id: '1',
    username: 'admin',
    password: 'admin123',
    realName: '系统管理员',
    role: 'admin',
    windowNumber: '',
    department: '信息管理科',
    phone: '13800000000',
    permissions: ['*'],
  },
  clerk01: {
    id: '2',
    username: 'clerk01',
    password: 'clerk123',
    realName: '李办事员',
    role: 'clerk',
    windowNumber: '01',
    department: '综合受理一科',
    phone: '13800000001',
    permissions: [
      'case:create',
      'case:update',
      'case:view',
      'queue:call',
      'queue:serve',
      'queue:miss',
    ],
  },
  clerk02: {
    id: '3',
    username: 'clerk02',
    password: 'clerk123',
    realName: '王办事员',
    role: 'clerk',
    windowNumber: '02',
    department: '综合受理二科',
    phone: '13800000002',
    permissions: [
      'case:create',
      'case:update',
      'case:view',
      'queue:call',
      'queue:serve',
      'queue:miss',
    ],
  },
  supervisor: {
    id: '4',
    username: 'supervisor',
    password: 'super123',
    realName: '张主管',
    role: 'supervisor',
    windowNumber: '',
    department: '业务督导科',
    phone: '13800000003',
    permissions: [
      'case:view',
      'case:update',
      'case:delete',
      'queue:view',
      'queue:manage',
      'report:view',
    ],
  },
  reviewer: {
    id: '5',
    username: 'reviewer',
    password: 'review123',
    realName: '陈审核',
    role: 'reviewer',
    windowNumber: '03',
    department: '审核审批科',
    phone: '13800000004',
    permissions: [
      'case:view',
      'case:review',
      'case:approve',
      'case:reject',
    ],
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,

  login: async (username, password) => {
    set({ loading: true });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = MOCK_USERS[username];

    if (found && found.password === password) {
      const { password: _pw, ...userInfo } = found;
      const mockToken = `token_${username}_${Date.now()}`;

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(userInfo));

      set({
        user: userInfo,
        token: mockToken,
        isLoggedIn: true,
        loading: false,
      });
      return { success: true };
    }

    set({ loading: false });
    return { success: false, message: '用户名或密码错误' };
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
    set({ user });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
    set({ token });
  },

  setWindowNumber: (windowNumber) => {
    const { user, updateUser } = get();
    if (user) {
      updateUser({ windowNumber });
    }
  },

  setRole: (role) => {
    const { user, updateUser } = get();
    if (user) {
      updateUser({ role });
    }
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      const updated = { ...user, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      set({ user: updated });
    }
  },

  hasPermission: (permission) => {
    const { user } = get();
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },

  setLoading: (loading) => set({ loading }),

  restoreSession: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo;
        set({
          user,
          token,
          isLoggedIn: true,
        });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },
}));
