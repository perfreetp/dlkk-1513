import { Badge } from 'antd';
import { cn } from '@/lib/utils';

export type CaseStatus =
  | 'pending'
  | 'processing'
  | 'verified'
  | 'supplement'
  | 'returned'
  | 'completed'
  | 'expired';

interface StatusBadgeProps {
  status: CaseStatus;
  text?: string;
  size?: 'small' | 'default';
  showDot?: boolean;
  className?: string;
}

const statusConfig: Record<
  CaseStatus,
  { color: string; bg: string; dot: string; label: string; antdColor: string }
> = {
  pending: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    dot: '#d97706',
    label: '待办理',
    antdColor: 'gold',
  },
  processing: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    dot: '#2563eb',
    label: '办理中',
    antdColor: 'blue',
  },
  verified: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    dot: '#059669',
    label: '核验通过',
    antdColor: 'green',
  },
  supplement: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    dot: '#ea580c',
    label: '待补正',
    antdColor: 'orange',
  },
  returned: {
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    dot: '#dc2626',
    label: '已退回',
    antdColor: 'red',
  },
  completed: {
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    dot: '#64748b',
    label: '已办结',
    antdColor: 'default',
  },
  expired: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    dot: '#b91c1c',
    label: '已超期',
    antdColor: 'red',
  },
};

export default function StatusBadge({
  status,
  text,
  size = 'default',
  showDot = true,
  className,
}: StatusBadgeProps) {
  const cfg = statusConfig[status];
  const displayText = text ?? cfg.label;
  const padding = size === 'small' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium',
        cfg.color,
        cfg.bg,
        padding,
        className,
      )}
    >
      {showDot && <Badge color={cfg.antdColor} />}
      <span>{displayText}</span>
    </span>
  );
}
