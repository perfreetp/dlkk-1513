import { CheckCircle2, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MaterialItem {
  id: string;
  name: string;
  required: boolean;
  provided: boolean;
  isElectronicLicense?: boolean;
  licenseSource?: string;
  remark?: string;
}

interface MaterialCheckProps {
  items: MaterialItem[];
  title?: string;
  showCount?: boolean;
  className?: string;
}

export default function MaterialCheck({
  items,
  title = '申请材料清单',
  showCount = true,
  className,
}: MaterialCheckProps) {
  const requiredTotal = items.filter((i) => i.required).length;
  const requiredProvided = items.filter((i) => i.required && i.provided).length;
  const missingCount = items.filter((i) => i.required && !i.provided).length;

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-600" />
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        {showCount && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">
              必填项：
              <span className={cn('font-semibold', missingCount > 0 ? 'text-red-600' : 'text-emerald-600')}>
                {requiredProvided}/{requiredTotal}
              </span>
            </span>
            {missingCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <AlertCircle size={12} />
                缺 {missingCount} 项
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <li
            key={item.id}
            className={cn(
              'flex items-center gap-4 px-5 py-3 transition-colors',
              !item.provided && item.required ? 'bg-red-50/40' : 'hover:bg-slate-50/60',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                item.provided
                  ? 'bg-emerald-100 text-emerald-700'
                  : item.required
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-500',
              )}
            >
              {item.provided ? (
                <CheckCircle2 size={16} />
              ) : (
                <span>{String(idx + 1).padStart(2, '0')}</span>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'truncate text-sm font-medium',
                    !item.provided && item.required ? 'text-red-700' : 'text-slate-800',
                  )}
                >
                  {item.name}
                </span>
                {item.required ? (
                  <span className="shrink-0 text-xs font-semibold text-red-500">*必选</span>
                ) : (
                  <span className="shrink-0 text-xs text-slate-400">选填</span>
                )}
                {item.isElectronicLicense && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    <ShieldCheck size={11} />
                    电子证照
                    {item.licenseSource && (
                      <span className="text-indigo-500">({item.licenseSource})</span>
                    )}
                  </span>
                )}
              </div>
              {item.remark && (
                <p className="mt-0.5 text-xs text-slate-500">{item.remark}</p>
              )}
            </div>

            <div className="shrink-0">
              {item.provided ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={12} />
                  已提交
                </span>
              ) : item.required ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                  <AlertCircle size={12} />
                  缺失
                </span>
              ) : (
                <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                  未提交
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
