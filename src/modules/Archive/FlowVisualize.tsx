import { Card, Steps, Tag, Descriptions, Tooltip, Drawer } from 'antd';
import { useMemo, useState } from 'react';
import {
  Workflow,
  BellRing,
  FilePlus2,
  ClipboardCheck,
  Share2,
  BadgeCheck,
  CheckCircle2,
  Archive,
  ChevronRight,
  User,
  Clock,
  Info,
  CircleCheck,
  CircleDot,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArchiveStore, type FlowStep } from '@/store/archiveStore';

const iconMap: Record<string, any> = {
  BellRing,
  FilePlus2,
  ClipboardCheck,
  Share2,
  BadgeCheck,
  CheckCircle2,
  Archive,
};

const statusColorMap: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  completed: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: '#059669',
  },
  current: {
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    dot: '#2563eb',
  },
  pending: {
    text: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: '#94a3b8',
  },
};

export default function FlowVisualize() {
  const { flowSteps, setSelectedFlowStepId, selectedFlowStepId } = useArchiveStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentStep = useMemo(
    () => flowSteps.find((s) => s.status === 'current'),
    [flowSteps],
  );

  const selectedStep = useMemo(
    () => flowSteps.find((s) => s.id === selectedFlowStepId),
    [flowSteps, selectedFlowStepId],
  );

  const handleNodeClick = (step: FlowStep) => {
    setSelectedFlowStepId(step.id);
    setDrawerOpen(true);
  };

  const customSteps = flowSteps.map((step) => {
    const IconComp = iconMap[step.icon] || Info;
    const cfg = statusColorMap[step.status];
    const isCurrent = step.status === 'current';

    return {
      title: (
        <Tooltip title="点击查看详情">
          <div
            onClick={() => handleNodeClick(step)}
            className={cn(
              'cursor-pointer text-center transition-colors',
              isCurrent ? cfg.text : '',
            )}
          >
            <span className={cn('text-sm font-semibold', cfg.text)}>
              {step.title}
            </span>
          </div>
        </Tooltip>
      ),
      description: (
        <div className="mt-1 text-center text-[11px] text-slate-400">
          {step.operateTime !== '-' ? step.operateTime.slice(5, 16) : '等待中'}
        </div>
      ),
      status: (
        step.status === 'completed'
          ? 'finish'
          : step.status === 'current'
            ? 'process'
            : 'wait'
      ) as 'finish' | 'process' | 'wait' | 'error',
      icon: (
        <div
          onClick={() => handleNodeClick(step)}
          className={cn(
            'relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300',
            cfg.bg,
            cfg.border,
            isCurrent
              ? 'shadow-[0_0_0_4px_rgba(37,99,235,0.1),0_0_20px_rgba(37,99,235,0.4)] scale-110 border-primary-500'
              : '',
          )}
        >
          {isCurrent && (
            <>
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-30" />
              <div className="absolute -inset-1 animate-pulse rounded-full bg-blue-300/20" />
            </>
          )}
          {step.status === 'completed' ? (
            <CircleCheck size={22} className="relative text-emerald-600" />
          ) : step.status === 'current' ? (
            <CircleDot size={22} className="relative text-blue-600" />
          ) : (
            <Circle size={22} className="relative text-slate-400" />
          )}
          <IconComp
            size={13}
            className={cn(
              'absolute -bottom-1 -right-1 rounded-full border-2 border-white p-0.5',
              step.status === 'completed'
                ? 'bg-emerald-500 text-white'
                : step.status === 'current'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-300 text-white',
            )}
          />
        </div>
      ),
    };
  });

  const completedCount = flowSteps.filter((s) => s.status === 'completed').length;
  const totalCount = flowSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <>
      <Card
        title={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <Workflow size={18} className="text-primary-600" />
              办件流向可视化
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary-600">
                  {completedCount}/{totalCount}
                </span>
              </div>
              {currentStep && (
                <Tag
                  color="processing"
                  className="m-0 animate-pulse"
                  icon={<ChevronRight size={12} />}
                >
                  当前：{currentStep.title}
                </Tag>
              )}
            </div>
          </div>
        }
        className="h-full"
      >
        <div className="mb-6 overflow-x-auto overflow-y-visible py-2">
          <div className="min-w-[700px]">
            <Steps
              current={flowSteps.findIndex((s) => s.status !== 'completed')}
              items={customSteps}
              size="default"
              className="[&_.ant-steps-item-tail]:!top-5 [&_.ant-steps-item-tail]:!mx-3 [&_.ant-steps-item-icon]:!bg-transparent [&_.ant-steps-item-icon]:!border-none [&_.ant-steps-item-icon]:!w-auto [&_.ant-steps-item-icon]:!h-auto [&_.ant-steps-item-icon]:!p-0 [&_.ant-steps-item-content]:!min-w-[80px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {flowSteps.map((step) => {
            const cfg = statusColorMap[step.status];
            const IconComp = iconMap[step.icon] || Info;
            const isCurrent = step.status === 'current';

            return (
              <div
                key={step.id}
                onClick={() => handleNodeClick(step)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-xl border-2 p-3.5 transition-all duration-300 hover:-translate-y-0.5',
                  cfg.bg,
                  cfg.border,
                  isCurrent
                    ? 'border-primary-500 shadow-lg shadow-blue-100'
                    : 'hover:shadow-md',
                )}
              >
                {isCurrent && (
                  <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500" />
                )}

                <div className="mb-2 flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110',
                      step.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : step.status === 'current'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-slate-200 text-slate-500',
                    )}
                  >
                    <IconComp size={18} />
                  </div>

                  {step.status === 'completed' ? (
                    <Tag color="success" className="m-0">
                      已完成
                    </Tag>
                  ) : step.status === 'current' ? (
                    <Tag color="processing" className="m-0">
                      进行中
                    </Tag>
                  ) : (
                    <Tag className="m-0 border-slate-200 bg-slate-100 text-slate-500">
                      待处理
                    </Tag>
                  )}
                </div>

                <h4
                  className={cn(
                    'mb-1 text-sm font-bold',
                    step.status === 'pending' ? 'text-slate-500' : 'text-slate-800',
                  )}
                >
                  {step.title}
                </h4>

                <p className="mb-2 line-clamp-2 min-h-[36px] text-xs leading-relaxed text-slate-500">
                  {step.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dashed border-slate-200/70 pt-2 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-500">
                    <User size={11} />
                    <span className={step.operator === '-' ? 'text-slate-400' : 'text-slate-700'}>
                      {step.operator}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock size={11} />
                    <span className={step.operateTime === '-' ? 'text-slate-400' : 'text-slate-600'}>
                      {step.operateTime === '-' ? '未开始' : step.operateTime.slice(5, 16)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <Info size={18} className="text-primary-600" />
            流程节点详情
          </div>
        }
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedFlowStepId(null);
        }}
      >
        {selectedStep && (
          <div className="space-y-5">
            <div
              className={cn(
                'rounded-xl border-2 p-5',
                statusColorMap[selectedStep.status].bg,
                statusColorMap[selectedStep.status].border,
              )}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm',
                    selectedStep.status === 'completed'
                      ? 'bg-emerald-500 text-white'
                      : selectedStep.status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-300 text-white',
                  )}
                >
                  {(() => {
                    const Ic = iconMap[selectedStep.icon] || Info;
                    return <Ic size={28} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedStep.title}
                  </h3>
                  <div className="mt-0.5">
                    {selectedStep.status === 'completed' ? (
                      <Tag color="success">已完成</Tag>
                    ) : selectedStep.status === 'current' ? (
                      <Tag color="processing">进行中</Tag>
                    ) : (
                      <Tag className="border-slate-200 bg-slate-100 text-slate-500">
                        待处理
                      </Tag>
                    )}
                  </div>
                </div>
              </div>

              <p className="rounded-lg bg-white/60 p-3 text-sm leading-relaxed text-slate-700">
                {selectedStep.description}
              </p>
            </div>

            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{
                width: 100,
                backgroundColor: '#f8fafc',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              <Descriptions.Item label="操作人">
                {selectedStep.operator === '-' ? '—' : selectedStep.operator}
              </Descriptions.Item>
              <Descriptions.Item label="操作时间">
                {selectedStep.operateTime === '-' ? '—' : selectedStep.operateTime}
              </Descriptions.Item>
              <Descriptions.Item label="节点顺序">
                <Tag color="blue">
                  第 {flowSteps.findIndex((s) => s.id === selectedStep.id) + 1} 步
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="节点状态">
                {selectedStep.status === 'completed'
                  ? '本节点已处理完成，数据已归档'
                  : selectedStep.status === 'current'
                    ? '本节点正在处理，请跟进进度'
                    : '本节点待前置节点完成后自动触发'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </>
  );
}
