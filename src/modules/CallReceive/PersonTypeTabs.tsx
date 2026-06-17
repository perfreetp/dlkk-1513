import { Tabs } from 'antd';
import { UserPlus, Users, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PersonType = 'parents' | 'guardian' | 'agent';

interface PersonTypeTabsProps {
  value: PersonType;
  onChange: (value: PersonType) => void;
  className?: string;
}

const tabItems = [
  {
    key: 'parents' as PersonType,
    label: '父母双方',
    icon: Users,
    description: '新生儿父母共同办理',
  },
  {
    key: 'guardian' as PersonType,
    label: '监护人',
    icon: UserCheck,
    description: '法定监护人单独办理',
  },
  {
    key: 'agent' as PersonType,
    label: '委托代理人',
    icon: UserPlus,
    description: '委托他人代为办理',
  },
];

export default function PersonTypeTabs({ value, onChange, className }: PersonTypeTabsProps) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-1', className)}>
      <Tabs
        activeKey={value}
        onChange={(key) => onChange(key as PersonType)}
        className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-tab]:!flex-1 [&_.ant-tabs-tab]:!m-0 [&_.ant-tabs-tab]:!rounded-lg [&_.ant-tabs-ink-bar]:!hidden"
        items={tabItems.map((item) => ({
          key: item.key,
          label: (
            <div className="flex items-center gap-3 py-2">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  value === item.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    value === item.key ? 'text-blue-700' : 'text-slate-600',
                  )}
                >
                  {item.label}
                </span>
                <span className="text-xs text-slate-400">{item.description}</span>
              </div>
            </div>
          ),
        }))}
      />
    </div>
  );
}
