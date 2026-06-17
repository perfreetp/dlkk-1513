import { useEffect, useState } from 'react';
import { Avatar, Badge, Dropdown, Input, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  Search,
  Bell,
  LogOut,
  Settings,
  UserCircle2,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

interface HeaderBarProps {
  windowNumber?: string;
  pendingCount?: number;
  alertCount?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function HeaderBar({
  windowNumber = '综合窗口-03',
  pendingCount = 12,
  alertCount = 3,
  userName = '张三',
  userRole = '综合受理员',
  userAvatar,
  onSearch,
  className,
}: HeaderBarProps) {
  const [now, setNow] = useState(dayjs());
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userMenu: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserCircle2 size={16} />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: '系统设置',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <header
      className={cn(
        'h-16 shrink-0 border-b border-slate-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800',
        'px-6 flex items-center justify-between text-white shadow-md',
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide">出生一件事联办工作台</h1>
            <p className="text-xs text-blue-200/90">政务服务中心 · 出生事项集成办理</p>
          </div>
        </div>

        <div className="ml-4 h-8 w-px bg-white/20" />

        <div className="flex items-center gap-3">
          <Tag
            color="blue"
            bordered={false}
            className="!m-0 !rounded-md !bg-white/20 !px-3 !py-1 !text-sm !font-semibold"
          >
            🪟 {windowNumber}
          </Tag>

          <Badge
            count={pendingCount}
            size="default"
            color="#f59e0b"
            className="[&_.ant-badge-count]:!bg-amber-500 [&_.ant-badge-count]:!shadow-lg"
          >
            <div className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              📋 待办
            </div>
          </Badge>

          <Badge
            count={alertCount}
            size="default"
            color="#ef4444"
            className="[&_.ant-badge-count]:!animate-pulse [&_.ant-badge-count]:!bg-red-500 [&_.ant-badge-count]:!shadow-lg"
          >
            <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <AlertTriangle size={14} />
              时限预警
            </div>
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-3 md:flex">
          <Search
            size={22}
            className="shrink-0 text-white/70"
          />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={() => onSearch?.(searchValue)}
            placeholder="搜索办件编号 / 申请人 / 事项名称"
            allowClear
            className="!w-72 !rounded-lg !border-0 !bg-white/15 !text-white placeholder:!text-white/60 [&>input]:!text-white [&>input::placeholder]:!text-white/60 [&_.ant-input-clear-icon]:!text-white/70 hover:!bg-white/20 focus:!bg-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          />
        </div>

        <div className="h-6 w-px bg-white/20" />

        <div className="flex flex-col items-end text-right">
          <span className="font-mono text-lg font-bold tabular-nums leading-none">
            {now.format('HH:mm:ss')}
          </span>
          <span className="mt-1 text-xs text-blue-200">
            {now.format('YYYY年MM月DD日')} {now.format('dddd')}
          </span>
        </div>

        <div className="h-6 w-px bg-white/20" />

        <Dropdown menu={{ items: userMenu }} placement="bottomRight" arrow>
          <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/10">
            <Badge
              count={5}
              size="small"
              color="#22c55e"
              offset={[-2, 2]}
              className="[&_.ant-badge-dot]:!w-2.5 [&_.ant-badge-dot]:!h-2.5"
            >
              <Avatar
                size={36}
                src={userAvatar}
                style={{
                  backgroundColor: '#3b82f6',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
                icon={<UserCircle2 size={22} />}
              />
            </Badge>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold leading-none">{userName}</span>
              <span className="mt-1 text-xs text-blue-200">{userRole}</span>
            </div>
          </div>
        </Dropdown>

        <button className="relative rounded-lg p-2 transition-colors hover:bg-white/10">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
