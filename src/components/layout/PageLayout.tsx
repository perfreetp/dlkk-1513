import { ReactNode } from 'react';
import HeaderBar from './HeaderBar';
import SideNav, { type NavKey } from './SideNav';
import { cn } from '@/lib/utils';
import { Breadcrumb } from 'antd';
import type { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';

export type BreadcrumbItem = BreadcrumbItemType & {
  title: ReactNode;
  href?: string;
};

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  activeNav?: NavKey;
  onNavSelect?: (key: NavKey) => void;
  sidebarCollapsed?: boolean;
  onSidebarCollapsedChange?: (collapsed: boolean) => void;
  headerClassName?: string;
  sidebarClassName?: string;
  contentClassName?: string;
  className?: string;
}

export default function PageLayout({
  children,
  title,
  subtitle,
  breadcrumb,
  activeNav,
  onNavSelect,
  sidebarCollapsed,
  onSidebarCollapsedChange,
  headerClassName,
  sidebarClassName,
  contentClassName,
  className,
}: PageLayoutProps) {
  const defaultBreadcrumb: BreadcrumbItem[] = [
    { title: '首页' },
    { title: title || '工作台' },
  ];
  const bcItems = breadcrumb ?? defaultBreadcrumb;

  return (
    <div className={cn('flex h-screen w-screen flex-col overflow-hidden bg-slate-50', className)}>
      <HeaderBar className={headerClassName} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNav
          className={sidebarClassName}
          activeKey={activeNav}
          onSelect={onNavSelect}
          collapsed={sidebarCollapsed}
          onCollapsedChange={onSidebarCollapsedChange}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {(title || breadcrumb) && (
            <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
              <Breadcrumb
                items={bcItems}
                className="!mb-2 text-xs [&_.ant-breadcrumb-link]:!text-slate-500 [&_.ant-breadcrumb-separator]:!text-slate-300"
              />
              <div className="flex items-end justify-between">
                <div>
                  {title && (
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            className={cn(
              'min-h-0 flex-1 overflow-y-auto px-6 py-5',
              contentClassName,
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
