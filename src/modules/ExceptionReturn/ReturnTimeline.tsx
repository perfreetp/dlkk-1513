import { Card, Tag } from 'antd';
import {
  GitBranch,
  User,
  Clock,
  MessageCircle,
  ArrowRight,
  Undo2,
  Eye,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useExceptionReturnStore,
  type TimelineNode,
} from '@/store/exceptionReturnStore';

const nodeIconMap: Record<string, any> = {
  '提交退回': Undo2,
  '部门审核': Eye,
  '复核确认': ShieldCheck,
  '群众补正': UserCheck,
  '重新受理': RefreshCw,
};

const statusConfig: Record<
  string,
  {
    dotBg: string;
    dotRing: string;
    lineColor: string;
    cardBg: string;
    cardBorder: string;
    labelColor: string;
    tagColor: string;
  }
> = {
  completed: {
    dotBg: 'bg-emerald-500',
    dotRing: 'ring-emerald-200',
    lineColor: 'bg-emerald-300',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-100',
    labelColor: 'text-emerald-700',
    tagColor: 'green',
  },
  current: {
    dotBg: 'bg-blue-500',
    dotRing: 'ring-blue-200',
    lineColor: 'bg-blue-200',
    cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    cardBorder: 'border-blue-300',
    labelColor: 'text-blue-700',
    tagColor: 'blue',
  },
  pending: {
    dotBg: 'bg-slate-300',
    dotRing: 'ring-slate-100',
    lineColor: 'bg-slate-200',
    cardBg: 'bg-slate-50',
    cardBorder: 'border-slate-200',
    labelColor: 'text-slate-500',
    tagColor: 'default',
  },
};

export default function ReturnTimeline() {
  const { timeline, caseNumber, applicantName } = useExceptionReturnStore();

  const statusLabelMap: Record<string, string> = {
    completed: '已完成',
    current: '进行中',
    pending: '待处理',
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <GitBranch size={18} className="text-primary-600" />
            退件流转时间线
          </span>
          <div className="flex items-center gap-2 text-xs">
            <Tag color="blue" className="m-0">
              办件号：{caseNumber}
            </Tag>
            <Tag color="purple" className="m-0">
              申请人：{applicantName}
            </Tag>
          </div>
        </div>
      }
      className="h-full"
    >
      <div className="relative pl-2 pr-1">
        {timeline.map((node: TimelineNode, index: number) => {
          const cfg = statusConfig[node.status];
          const IconComp = nodeIconMap[node.node] || CheckCircle2;
          const isLast = index === timeline.length - 1;
          const isCurrent = node.status === 'current';

          return (
            <div key={node.id} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-4.5 top-10 h-[calc(100%-2.5rem)] w-0.5',
                    cfg.lineColor,
                  )}
                  style={{ left: '18px' }}
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4',
                  cfg.dotBg,
                  cfg.dotRing,
                )}
              >
                {isCurrent ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-40" />
                    <IconComp size={16} className="relative text-white" />
                  </div>
                ) : node.status === 'pending' ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                ) : (
                  <IconComp size={16} className="text-white" />
                )}
              </div>

              <div
                className={cn(
                  'min-w-0 flex-1 rounded-xl border p-4 shadow-sm transition-all duration-300',
                  cfg.cardBg,
                  cfg.cardBorder,
                  isCurrent ? 'shadow-blue-100 shadow-lg' : '',
                )}
              >
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <h4
                      className={cn(
                        'text-base font-bold',
                        cfg.labelColor,
                      )}
                    >
                      {node.node}
                    </h4>
                    <Tag
                      color={cfg.tagColor as any}
                      className={cn(
                        'm-0 border-none',
                        isCurrent
                          ? 'bg-blue-100 text-blue-700'
                          : '',
                      )}
                    >
                      {statusLabelMap[node.status]}
                    </Tag>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {node.operateTime}
                  </div>
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1 text-slate-600">
                    <User size={12} className="text-slate-400" />
                    操作人：
                    <span
                      className={cn(
                        'font-medium',
                        node.status === 'pending'
                          ? 'text-slate-400'
                          : 'text-slate-700',
                      )}
                    >
                      {node.operator}
                    </span>
                  </span>
                </div>

                {node.remark && (
                  <div
                    className={cn(
                      'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs',
                      node.status === 'pending'
                        ? 'border-slate-200 bg-white text-slate-500'
                        : 'border-slate-200 bg-white/70 text-slate-600',
                    )}
                  >
                    <MessageCircle
                      size={12}
                      className={cn(
                        'mt-0.5 shrink-0',
                        node.status === 'current'
                          ? 'text-blue-500'
                          : 'text-slate-400',
                      )}
                    />
                    <span className="leading-relaxed">{node.remark}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-gradient-to-r from-primary-50/80 to-blue-50/80 py-3 text-sm">
          <ArrowRight size={16} className="text-primary-600" />
          <span className="text-slate-600">
            退件补正完成后，将自动进入
          </span>
          <span className="font-semibold text-primary-700">
            「重新受理」
          </span>
          <span className="text-slate-600">环节</span>
        </div>
      </div>
    </Card>
  );
}
