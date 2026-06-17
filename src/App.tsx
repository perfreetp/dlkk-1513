import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import CallReceive from '@/pages/CallReceive';
import InfoVerify from '@/pages/InfoVerify';
import ComboArrange from '@/pages/ComboArrange';
import Supplement from '@/pages/Supplement';
import ExceptionReturn from '@/pages/ExceptionReturn';
import Archive from '@/pages/Archive';
import { useEffect } from 'react';
import type { NavKey } from '@/components/layout/SideNav';

const routeToNavKey: Record<string, NavKey> = {
  '/home': 'home',
  '/dashboard': 'dashboard',
  '/call-receive': 'call-receive',
  '/info-verify': 'info-verify',
  '/combo-arrange': 'orchestration',
  '/supplement': 'supplement',
  '/exception-return': 'return',
  '/archive': 'archive',
};

function RouteNavigator() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavSelect = (event: CustomEvent<NavKey>) => {
      const navKey = event.detail;
      const routeMap: Record<NavKey, string> = {
        home: '/home',
        dashboard: '/dashboard',
        'call-receive': '/call-receive',
        'info-verify': '/info-verify',
        orchestration: '/combo-arrange',
        supplement: '/supplement',
        return: '/exception-return',
        archive: '/archive',
      };
      const targetRoute = routeMap[navKey];
      if (targetRoute && location.pathname !== targetRoute) {
        navigate(targetRoute);
      }
    };

    window.addEventListener('nav-select' as keyof WindowEventMap, handleNavSelect as EventListener);
    return () => {
      window.removeEventListener('nav-select' as keyof WindowEventMap, handleNavSelect as EventListener);
    };
  }, [location.pathname, navigate]);

  return null;
}

const theme = {
  token: {
    colorPrimary: '#1E40AF',
    colorInfo: '#1E40AF',
    colorLink: '#1E40AF',
    colorSuccess: '#059669',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    borderRadius: 8,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#F1F5F9',
    fontFamily: '"Source Han Sans SC", "Source Han Sans CN", "Noto Sans SC", "思源黑体", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    Button: {
      colorPrimary: '#1E40AF',
      algorithm: true,
      borderRadius: 8,
      controlHeight: 36,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 36,
      activeBorderColor: '#1E40AF',
      hoverBorderColor: '#3B82F6',
    },
    Select: {
      borderRadius: 8,
      controlHeight: 36,
      activeBorderColor: '#1E40AF',
      hoverBorderColor: '#3B82F6',
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      rowHoverBg: '#F8FAFC',
    },
    Menu: {
      itemBorderRadius: 8,
      subMenuItemBorderRadius: 8,
    },
    Tabs: {
      itemBorderRadius: 8,
      inkBarColor: '#1E40AF',
      itemSelectedColor: '#1E40AF',
      itemHoverColor: '#3B82F6',
    },
  },
};

export function getNavKeyFromRoute(pathname: string): NavKey {
  for (const [route, navKey] of Object.entries(routeToNavKey)) {
    if (pathname.startsWith(route)) {
      return navKey;
    }
  }
  return 'dashboard';
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntdApp>
        <Router>
          <RouteNavigator />
          <Routes>
            <Route path="/" element={<Navigate to="/call-receive" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-receive" element={<CallReceive />} />
            <Route path="/info-verify" element={<InfoVerify />} />
            <Route path="/combo-arrange" element={<ComboArrange />} />
            <Route path="/supplement" element={<Supplement />} />
            <Route path="/exception-return" element={<ExceptionReturn />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="*" element={<Navigate to="/call-receive" replace />} />
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}
