import { Card, Tag, Tooltip } from 'antd';
import {
  FileX,
  AlertCircle,
  ShieldAlert,
  ServerCrash,
  Briefcase,
  HelpCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useExceptionReturnStore,
  type ExceptionType,
  type SeverityLevel,
  type ExceptionCategory,
} from '@/store/exceptionReturnStore';

const iconMap: Record<string, any> = {
  FileX,
  FileX2: FileX,
  AlertCircle,
  ShieldAlert,
  ServerCrash,
  Briefcase,
  BriefcaseAlert: Briefcase,
  HelpCircle,
};

const severityConfig: Record<
  SeverityLevel,
  { label: string; color: string; bgColor: string; borderColor: string; icon: any }
> = {
  low: {
    label: '低',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Info,
  },
  medium: {
    label: '中',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: AlertTriangle,
  },
  high: {
    label: '高',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: AlertTriangle,
  },
  critical: {
    label: '严重',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    icon: AlertOctagon,
  },
};

export default function ExceptionTypes() {
  const {
    exceptionTypes,
    selectedExceptionType,
    setSelectedExceptionType,
  } = useExceptionReturnStore();

  const handleSelect = (key: ExceptionCategory) => {
    setSelectedExceptionType(selectedExceptionType === key ? null : key);
  };

  const renderSeverityBadge = (severity: SeverityLevel) => {
    const cfg = severityConfig[severity];
    const IconComp = cfg.icon;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
          cfg.color,
          cfg.bgColor,
          cfg.borderColor,
        )}
      >
        <IconComp size={12} />
        {cfg.label}级别
      </span>
    );
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <AlertCircle size={18} className="text-primary-600" />
            异常分类
          </span>
          <Tag color="blue" className="m-0">
            共 {exceptionTypes.length} 类
          </Tag>
        </div>
      }
      className="h-full"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-3">
        {exceptionTypes.map((item: ExceptionType) => {
          const IconComp = iconMap[item.icon] || AlertCircle;
          const isSelected = selectedExceptionType === item.key;
          const sevCfg = severityConfig[item.severity];

          return (
            <Tooltip title={item.description} key={item.id} placement="top">
              <div
                onClick={() => handleSelect(item.key)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 hover:-translate-y-0.5',
                  isSelected
                    ? cn(
                        'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100',
                      )
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-md',
                )}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}

                <div className="mb-3 flex items-start justify-between">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : cn(sevCfg.bgColor, sevCfg.color),
                    )}
                  >
                    <IconComp size={22} />
                  </div>
                  {renderSeverityBadge(item.severity)}
                </div>

                <div className="mb-2">
                  <h4
                    className={cn(
                      'text-base font-semibold transition-colors',
                      isSelected ? 'text-primary-700' : 'text-slate-800',
                    )}
                  >
                    {item.name}
                  </h4>
                </div>

                <p className="mb-3 line-clamp-2 min-h-[40px] text-xs text-slate-500">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2.5">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Flame size={12} className="text-orange-500" />
                    累计退件
                  </div>
                  <span
                    className={cn(
                      'text-sm font-bold',
                      isSelected ? 'text-primary-600' : sevCfg.color,
                    )}
                  >
                    {item.returnCount} 次
                  </span>
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
}
