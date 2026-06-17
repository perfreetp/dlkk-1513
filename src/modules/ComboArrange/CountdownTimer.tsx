import { useEffect, useMemo } from 'react';
import { useComboArrangeStore } from '@/store/comboArrangeStore';
import { Play, Pause, RotateCcw, Clock3, AlertTriangle, TimerReset } from 'lucide-react';
import { Button, Tooltip, Radio } from 'antd';
import { cn } from '@/lib/utils';

const durationPresets = [
  { label: '15分钟', value: 15 * 60 },
  { label: '20分钟', value: 20 * 60 },
  { label: '30分钟', value: 30 * 60 },
  { label: '45分钟', value: 45 * 60 },
];

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    h: String(hours).padStart(2, '0'),
    m: String(minutes).padStart(2, '0'),
    s: String(seconds).padStart(2, '0'),
    hours,
    minutes,
    seconds,
  };
}

export default function CountdownTimer() {
  const {
    countdownTotalSeconds,
    countdownRemaining,
    isCountdownRunning,
    setCountdownTotal,
    tickCountdown,
    startCountdown,
    pauseCountdown,
    resetCountdown,
  } = useComboArrangeStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isCountdownRunning && countdownRemaining > 0) {
      interval = setInterval(() => {
        tickCountdown();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountdownRunning, countdownRemaining, tickCountdown]);

  const progress = useMemo(() => {
    if (countdownTotalSeconds === 0) return 0;
    return (countdownRemaining / countdownTotalSeconds) * 100;
  }, [countdownRemaining, countdownTotalSeconds]);

  const time = formatTime(countdownRemaining);

  const warningLevel = useMemo(() => {
    if (countdownRemaining <= 60) return 'critical';
    if (countdownRemaining <= 300) return 'warning';
    return 'normal';
  }, [countdownRemaining]);

  const statusConfig = {
    normal: {
      ring: '#1E40AF',
      ringBg: '#DBEAFE',
      text: 'text-slate-800',
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      label: '受理进行中',
      labelColor: 'bg-blue-100 text-blue-700',
    },
    warning: {
      ring: '#D97706',
      ringBg: '#FEF3C7',
      text: 'text-amber-800',
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-300',
      label: '即将超时',
      labelColor: 'bg-amber-100 text-amber-700',
    },
    critical: {
      ring: '#DC2626',
      ringBg: '#FEE2E2',
      text: 'text-red-800',
      bg: 'from-red-50 to-rose-50',
      border: 'border-red-400',
      label: '紧急！即将超时',
      labelColor: 'bg-red-100 text-red-700',
    },
  }[warningLevel];

  const strokeWidth = 14;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isExpired = countdownRemaining === 0;

  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-6 transition-all duration-500',
        `bg-gradient-to-br ${statusConfig.bg} ${statusConfig.border}`,
        warningLevel === 'critical' && 'animate-pulse-missing'
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock3 className={cn('w-5 h-5', warningLevel === 'normal' ? 'text-[#1E40AF]' : warningLevel === 'warning' ? 'text-amber-600' : 'text-red-600')} />
          <h3 className="text-sm font-semibold text-slate-800">受理倒计时</h3>
        </div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1',
            statusConfig.labelColor,
            warningLevel === 'critical' && 'animate-pulse'
          )}
        >
          {warningLevel !== 'normal' && <AlertTriangle className="w-3 h-3" />}
          {statusConfig.label}
        </span>
      </div>

      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <svg width="220" height="220" className="-rotate-90">
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={statusConfig.ringBg}
              strokeWidth={strokeWidth}
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={statusConfig.ring}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={cn(
                'flex items-baseline gap-1 font-mono font-black tabular-nums',
                statusConfig.text
              )}
              style={{
                fontSize: time.hours > 0 ? '28px' : '36px',
                letterSpacing: '-0.02em',
              }}
            >
              {time.hours > 0 && (
                <>
                  <span>{time.h}</span>
                  <span className="text-2xl opacity-50 mx-0.5">:</span>
                </>
              )}
              <span
                className={cn(
                  warningLevel === 'critical' && 'animate-pulse',
                  isExpired && 'line-through opacity-50'
                )}
              >
                {time.m}
              </span>
              <span className="text-2xl opacity-50 mx-0.5">:</span>
              <span
                className={cn(
                  warningLevel === 'critical' && 'animate-pulse',
                  isExpired && 'line-through opacity-50'
                )}
              >
                {time.s}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1.5 font-medium">
              {isExpired ? '已超时' : time.hours > 0 ? '时 : 分 : 秒' : '分 : 秒'}
            </div>
            <div className="mt-2 px-3 py-1 rounded-full bg-white/70 text-[11px] font-medium text-slate-600 border border-slate-200">
              总时长 {Math.round(countdownTotalSeconds / 60)} 分钟 · 剩余 {progress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          {isCountdownRunning ? (
            <Tooltip title="暂停计时">
              <Button
                type="primary"
                icon={<Pause className="w-4 h-4" />}
                onClick={pauseCountdown}
                className={cn(
                  '!rounded-full !px-5 !h-10 !font-medium',
                  warningLevel === 'warning' && '!bg-amber-600 hover:!bg-amber-700',
                  warningLevel === 'critical' && '!bg-red-600 hover:!bg-red-700'
                )}
                style={warningLevel === 'normal' ? { backgroundColor: '#1E40AF' } : undefined}
              >
                暂停
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title={isExpired ? '已超时' : '开始计时'}>
              <Button
                type="primary"
                icon={<Play className="w-4 h-4" />}
                onClick={startCountdown}
                disabled={isExpired}
                className="!rounded-full !px-5 !h-10 !font-medium"
                style={{ backgroundColor: '#1E40AF' }}
              >
                {countdownRemaining === countdownTotalSeconds ? '开始' : '继续'}
              </Button>
            </Tooltip>
          )}
          <Tooltip title="重置计时">
            <Button
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={resetCountdown}
              className="!rounded-full !px-4 !h-10 !bg-white"
            >
              重置
            </Button>
          </Tooltip>
          <Tooltip title="延长时间">
            <Button
              icon={<TimerReset className="w-4 h-4" />}
              onClick={() => setCountdownTotal(countdownTotalSeconds + 5 * 60)}
              className="!rounded-full !px-4 !h-10 !bg-white"
            >
              +5分钟
            </Button>
          </Tooltip>
        </div>

        <div className="pt-2 border-t border-white/60">
          <div className="text-[11px] text-slate-500 mb-2 text-center">预设时长</div>
          <Radio.Group
            value={countdownTotalSeconds}
            onChange={(e) => setCountdownTotal(e.target.value)}
            size="small"
            className="!flex !justify-center"
            disabled={isCountdownRunning}
          >
            {durationPresets.map((p) => (
              <Radio.Button
                key={p.value}
                value={p.value}
                className="!rounded-lg !text-xs !h-7 !px-3"
              >
                {p.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}
