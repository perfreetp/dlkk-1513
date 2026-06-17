import { useEffect, useState } from 'react';
import { Button, Tag, Empty, Tooltip } from 'antd';
import {
  Play,
  RefreshCw,
  XCircle,
  Clock,
  User,
  Phone,
  FileText,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useQueueStore, type QueueItem, type QueueStatus } from '@/store/queueStore';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

const statusConfig: Record<
  QueueStatus,
  { label: string; color: string; borderColor: string; bgColor: string; textColor: string }
> = {
  waiting: {
    label: '等待中',
    color: 'amber',
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  calling: {
    label: '呼叫中',
    color: 'blue',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  serving: {
    label: '办理中',
    color: 'cyan',
    borderColor: 'border-l-cyan-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
  },
  completed: {
    label: '已完成',
    color: 'green',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  missed: {
    label: '过号',
    color: 'red',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
};

interface QueueCardProps {
  item: QueueItem;
  isCurrentCalling: boolean;
  onCallNext: () => void;
  onRecall: (id: string) => void;
  onMarkAsMissed: (id: string) => void;
}

function QueueCard({ item, isCurrentCalling, onCallNext, onRecall, onMarkAsMissed }: QueueCardProps) {
  const cfg = statusConfig[item.status];
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (isCurrentCalling) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCurrentCalling]);

  const showActions = item.status === 'calling' || item.status === 'waiting';
  const waitingMinutes = item.arrivalTime
    ? dayjs().diff(dayjs(item.arrivalTime), 'minute')
    : 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border-l-4 bg-white shadow-sm transition-all duration-500',
        cfg.borderColor,
        cfg.bgColor,
        isHighlighted && 'ring-2 ring-blue-400 ring-offset-2 animate-pulse',
        isCurrentCalling && 'scale-[1.02] shadow-lg z-10',
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={cn(
                'flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border-2 font-bold',
                isCurrentCalling
                  ? 'border-blue-500 bg-blue-600 text-white shadow-lg'
                  : 'border-slate-200 bg-white',
                isCurrentCalling ? 'text-white' : 'text-slate-800',
              )}
            >
              <span className="text-xs font-medium opacity-75">号码</span>
              <span className="text-2xl leading-none mt-1">{item.number}</span>
              {item.priority && (
                <div className="mt-1 flex items-center gap-0.5 text-[10px] font-medium text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  优先
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Tag color={cfg.color as any} className="!m-0">
                  {cfg.label}
                </Tag>
                {item.callCount > 1 && (
                  <Tag color="orange" className="!m-0">
                    第{item.callCount}次呼叫
                  </Tag>
                )}
                {item.windowNumber && (
                  <Tag color="purple" className="!m-0">
                    {item.windowNumber}
                  </Tag>
                )}
              </div>

              <div className="space-y-1.5">
                {item.applicantName && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{item.applicantName}</span>
                  </div>
                )}
                {item.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{item.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{item.serviceType}</span>
                </div>
                {item.arrivalTime && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {dayjs(item.arrivalTime).format('HH:mm')}取号 · 等待
                      {waitingMinutes > 0 ? `${waitingMinutes}分钟` : '中'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-col gap-2 shrink-0">
              {item.status === 'waiting' && (
                <Tooltip title="呼叫此号">
                  <Button
                    type="primary"
                    icon={<Play className="h-4 w-4" />}
                    onClick={onCallNext}
                    size="small"
                    className="!h-8"
                  >
                    呼叫
                  </Button>
                </Tooltip>
              )}
              {item.status === 'calling' && (
                <>
                  <Tooltip title="重新呼叫">
                    <Button
                      icon={<RefreshCw className="h-4 w-4" />}
                      onClick={() => onRecall(item.id)}
                      size="small"
                      className="!h-8"
                    >
                      重叫
                    </Button>
                  </Tooltip>
                  <Tooltip title="标记为过号">
                    <Button
                      danger
                      icon={<XCircle className="h-4 w-4" />}
                      onClick={() => onMarkAsMissed(item.id)}
                      size="small"
                      className="!h-8"
                    >
                      过号
                    </Button>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isCurrentCalling && (
        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400 animate-pulse" />
      )}
    </div>
  );
}

interface QueueListProps {
  className?: string;
  onCallNextSuccess?: (item: QueueItem | null) => void;
}

export default function QueueList({ className, onCallNextSuccess }: QueueListProps) {
  const {
    queueList,
    currentCalling,
    callNext,
    recall,
    markAsMissed,
    getWaitingCount,
    getNextWaiting,
  } = useQueueStore();

  const sortedQueue = [...queueList].sort((a, b) => {
    const statusOrder: Record<QueueStatus, number> = {
      calling: 0,
      serving: 1,
      waiting: 2,
      missed: 3,
      completed: 4,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    if (a.priority !== b.priority) return b.priority ? 1 : -1;
    return dayjs(a.arrivalTime).valueOf() - dayjs(b.arrivalTime).valueOf();
  });

  const waitingCount = getWaitingCount();
  const nextWaiting = getNextWaiting();

  const handleCallNext = () => {
    const result = callNext();
    onCallNextSuccess?.(result);
  };

  const handleRecall = (id: string) => {
    recall(id);
  };

  const handleMarkAsMissed = (id: string) => {
    markAsMissed(id);
  };

  return (
    <div className={cn('flex h-full flex-col gap-4', className)}>
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">当前等待</span>
            <span className="text-2xl font-bold text-slate-800">
              {waitingCount}
              <span className="ml-1 text-sm font-normal text-slate-500">人</span>
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">下一位</span>
            <span className="text-xl font-semibold text-blue-600">
              {nextWaiting?.number || '—'}
            </span>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<ChevronRight className="h-5 w-5" />}
          onClick={handleCallNext}
          disabled={waitingCount === 0}
          className="!h-11 !px-6 !text-base font-semibold"
        >
          呼叫下一号
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {sortedQueue.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty description="暂无等待队列" />
          </div>
        ) : (
          sortedQueue.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              isCurrentCalling={currentCalling?.id === item.id}
              onCallNext={handleCallNext}
              onRecall={handleRecall}
              onMarkAsMissed={handleMarkAsMissed}
            />
          ))
        )}
      </div>
    </div>
  );
}
