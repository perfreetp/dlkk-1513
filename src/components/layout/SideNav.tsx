import { useState } from 'react';
import { Badge, Tooltip } from 'antd';
import {
  Home,
  UserRoundPlus,
  ShieldCheck,
  GitBranch,
  FileWarning,
  RotateCcw,
  Archive,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavKey =
  | 'home'
  | 'dashboard'
  | 'call-receive'
  | 'info-verify'
  | 'orchestration'
  | 'supplement'
  | 'return'
  | 'archive';

export interface NavItem {
  key: NavKey;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeColor?: string;
  description?: string;
}

interface SideNavProps {
  activeKey?: NavKey;
  onSelect?: (key: NavKey) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

const defaultNavItems: NavItem[] = [
  {
    key: 'home',
    label: '工作台首页',
    icon: Home,
    description: '概览与快捷入口',
  },
  {
    key: 'dashboard',
    label: '统计仪表盘',
    icon: LayoutDashboard,
    description: '今日办件概览',
  },
  {
    key: 'call-receive',
    label: '叫号接件',
    icon: UserRoundPlus,
    badge: 15,
    badgeColor: '#3b82f6',
    description: '叫号、受理、登记',
  },
  {
    key: 'info-verify',
    label: '信息核验',
    icon: ShieldCheck,
    badge: 8,
    badgeColor: '#10b981',
    description: '材料核验、电子证照',
  },
  {
    key: 'orchestration',
    label: '联办编排',
    icon: GitBranch,
    badge: 6,
    badgeColor: '#8b5cf6',
    description: '事项流转、节点分配',
  },
  {
    key: 'supplement',
    label: '补正处置',
    icon: FileWarning,
    badge: 4,
    badgeColor: '#f59e0b',
    description: '材料缺失、补充通知',
  },
  {
    key: 'return',
    label: '异常退回',
    icon: RotateCcw,
    badge: 2,
    badgeColor: '#ef4444',
    description: '异常处理、退回重办',
  },
  {
    key: 'archive',
    label: '办结归档',
    icon: Archive,
    description: '办结、归档、出件',
  },
];

export default function SideNav({
  activeKey = 'call-receive',
  onSelect,
  collapsed: externalCollapsed,
  onCollapsedChange,
  className,
}: SideNavProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = externalCollapsed ?? internalCollapsed;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const handleClick = (key: NavKey) => {
    onSelect?.(key);
    const event = new CustomEvent('nav-select', { detail: key });
    window.dispatchEvent(event);
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        className,
      )}
    >
      <div className="flex flex-1 flex-col overflow-y-auto py-3">
        <nav className="flex flex-col gap-1 px-3">
          {defaultNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;
            const isFirst = item.key === 'home';

            return (
              <Tooltip
                key={item.key}
                title={collapsed ? item.label : ''}
                placement="right"
              >
                <button
                  onClick={() => handleClick(item.key)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                    isFirst && collapsed ? 'mb-3' : '',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200/60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700',
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-white/90" />
                  )}

                  <Badge
                    count={item.badge}
                    size="small"
                    color={item.badgeColor || '#94a3b8'}
                    dot={!item.badge}
                    offset={item.badge ? [2, -2] : undefined}
                    showZero={false}
                  >
                    <Icon
                      size={collapsed ? 22 : 20}
                      className={cn(
                        'shrink-0 transition-all',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-blue-600',
                      )}
                    />
                  </Badge>

                  {!collapsed && (
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold">{item.label}</span>
                      {item.description && (
                        <span
                          className={cn(
                            'mt-0.5 truncate text-xs',
                            isActive ? 'text-blue-100' : 'text-slate-400',
                          )}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-xs font-bold',
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </nav>

        <div className="mt-auto px-3">
          <div
            className={cn(
              'mb-4 rounded-xl border p-3',
              collapsed ? 'hidden' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
            )}
          >
            <div className="flex items-center gap-2 text-amber-800">
              <span className="text-lg">⏰</span>
              <span className="text-xs font-bold">时限提醒</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-700">
              当前有 <span className="font-bold text-red-600">3</span> 件办件即将超期，请尽快处理
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={toggleCollapsed}
        className="flex h-11 shrink-0 items-center justify-center gap-2 border-t border-slate-100 text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600"
      >
        {collapsed ? (
          <>
            <ChevronRight size={16} />
            <span className="hidden">展开</span>
          </>
        ) : (
          <>
            <ChevronLeft size={16} />
            <span>收起侧边栏</span>
          </>
        )}
      </button>
    </aside>
  );
}
