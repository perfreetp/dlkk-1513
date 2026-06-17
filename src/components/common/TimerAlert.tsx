import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock } from 'lucide-react';

interface TimerAlertProps {
  totalMinutes: number;
  remainingMinutes?: number;
  startTime?: Date | string | number;
  deadline?: Date | string | number;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
  onComplete?: () => void;
}

export default function TimerAlert({
  totalMinutes,
  remainingMinutes: externalRemaining,
  startTime,
  deadline,
  size = 'medium',
  showText = true,
  className,
  onComplete,
}: TimerAlertProps) {
  const [internalRemaining, setInternalRemaining] = useState<number>(() => {
    if (externalRemaining !== undefined) return externalRemaining * 60;
    if (deadline) {
      return Math.max(0, (new Date(deadline).getTime() - Date.now()) / 1000);
    }
    if (startTime) {
      const totalSec = totalMinutes * 60;
      const elapsed = (Date.now() - new Date(startTime).getTime()) / 1000;
      return Math.max(0, totalSec - elapsed);
    }
    return totalMinutes * 60;
  });

  useEffect(() => {
    if (externalRemaining !== undefined) {
      setInternalRemaining(externalRemaining * 60);
      return;
    }
    const timer = setInterval(() => {
      setInternalRemaining((prev) => {
        if (prev <= 0) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [externalRemaining, onComplete]);

  const { percentage, minutes, seconds, displayText, level } = useMemo(() => {
    const totalSec = totalMinutes * 60;
    const remaining = Math.max(0, internalRemaining);
    const pct = (remaining / totalSec) * 100;
    const min = Math.floor(remaining / 60);
    const sec = Math.floor(remaining % 60);
    let lv: 'normal' | 'warning' | 'danger' = 'normal';
    if (remaining <= 60) lv = 'danger';
    else if (remaining <= 300) lv = 'warning';

    return {
      percentage: pct,
      minutes: min,
      seconds: sec,
      displayText: `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`,
      level: lv,
    };
  }, [internalRemaining, totalMinutes]);

  const sizeConfig = {
    small: { outer: 48, inner: 34, stroke: 4, text: 'text-xs', icon: 14 },
    medium: { outer: 64, inner: 48, stroke: 5, text: 'text-sm', icon: 18 },
    large: { outer: 88, inner: 68, stroke: 6, text: 'text-lg', icon: 22 },
  };
  const cfg = sizeConfig[size];
  const radius = (cfg.outer - cfg.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    normal: { stroke: '#2563eb', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    warning: {
      stroke: '#d97706',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    danger: { stroke: '#dc2626', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  };
  const color = colorMap[level];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-lg border px-3 py-2',
        color.bg,
        color.border,
        level === 'danger' && 'animate-pulse',
        className,
      )}
    >
      <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
        <svg width={cfg.outer} height={cfg.outer} className="-rotate-90">
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={cfg.stroke}
          />
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {level === 'danger' ? (
            <AlertTriangle size={cfg.icon} className={color.text} />
          ) : (
            <Clock size={cfg.icon} className={color.text} />
          )}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-mono font-bold tabular-nums', color.text, cfg.text)}>
            {displayText}
          </span>
          <span className="text-xs text-slate-500">
            {level === 'normal' && '办理时限内'}
            {level === 'warning' && '即将超时'}
            {level === 'danger' && '即将超期！'}
          </span>
        </div>
      )}
    </div>
  );
}
