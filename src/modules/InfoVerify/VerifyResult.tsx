import { Button, Tag, Empty, Spin, Progress } from 'antd';
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  FileCheck2,
  ClipboardCheck,
  Fingerprint,
} from 'lucide-react';
import { useVerifyStore, type VerifyDetailItem } from '@/store/verifyStore';
import StampIcon from '@/components/common/StampIcon';
import { cn } from '@/lib/utils';

const categoryConfig = {
  证件一致性: {
    icon: FileCheck2,
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  材料完整性: {
    icon: ClipboardCheck,
    color: 'emerald',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  信息有效性: {
    icon: Fingerprint,
    color: 'purple',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
};

const statusConfig = {
  passed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: '通过',
    tagColor: 'success' as const,
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: '不通过',
    tagColor: 'error' as const,
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: '需人工核验',
    tagColor: 'warning' as const,
  },
};

interface DetailItemProps {
  item: VerifyDetailItem;
  index: number;
}

function DetailItem({ item, index }: DetailItemProps) {
  const catCfg = categoryConfig[item.category];
  const stCfg = statusConfig[item.status];
  const StatusIcon = stCfg.icon;
  const CatIcon = catCfg.icon;

  return (
    <div
      className={cn(
        'group rounded-xl border-2 bg-white p-4 transition-all duration-300 hover:shadow-md',
        stCfg.border,
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform',
            catCfg.iconBg,
            'group-hover:scale-110',
          )}
        >
          <CatIcon className={cn('h-5 w-5', catCfg.iconColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <Tag
                  color={catCfg.color as any}
                  className="!m-0 !text-xs !border-none"
                >
                  <span className="flex items-center gap-1">
                    <CatIcon className="h-3 w-3" />
                    {item.category}
                  </span>
                </Tag>
                <Tag color={stCfg.tagColor} className="!m-0 !text-xs">
                  <span className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {stCfg.label}
                  </span>
                </Tag>
              </div>
            </div>
            <div className="text-sm font-mono text-slate-400">#{String(index + 1).padStart(2, '0')}</div>
          </div>
          <p className={cn('text-sm leading-relaxed', stCfg.color)}>{item.message}</p>
        </div>
      </div>
    </div>
  );
}

interface VerifyResultProps {
  className?: string;
  onReVerify?: () => void;
  onNextStep?: () => void;
}

export default function VerifyResult({ className, onReVerify, onNextStep }: VerifyResultProps) {
  const { verifyStatus, verifyDetails, runVerify, resetVerify, certs } = useVerifyStore();

  const allCertsRead = Object.values(certs).every((c) => c.status === 'success');
  const canVerify = allCertsRead && verifyStatus !== 'verifying';

  const categories = ['证件一致性', '材料完整性', '信息有效性'] as const;
  const groupedDetails = categories.map((cat) => ({
    category: cat,
    items: verifyDetails.filter((d) => d.category === cat),
  }));

  const passedCount = verifyDetails.filter((d) => d.status === 'passed').length;
  const failedCount = verifyDetails.filter((d) => d.status === 'failed').length;
  const warningCount = verifyDetails.filter((d) => d.status === 'warning').length;
  const totalCount = verifyDetails.length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const handleRunVerify = async () => {
    await runVerify();
  };

  const handleReset = () => {
    resetVerify();
  };

  if (verifyStatus === 'pending') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <ShieldAlert className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">核验结果</h3>
              <p className="text-sm text-slate-500">
                {allCertsRead ? '证照读取完成，点击下方按钮开始核验' : '请先完成所有证照读取后再进行核验'}
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ShieldCheck className="h-4 w-4" />}
            onClick={handleRunVerify}
            disabled={!canVerify}
            className="!h-9 !px-5"
          >
            开始核验
          </Button>
        </div>

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-16">
          <Empty
            image={
              <div className="mb-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                  <ShieldCheck className="h-10 w-10 text-slate-400" />
                </div>
              </div>
            }
            description={
              <div className="space-y-3">
                <p className="text-slate-600 font-medium text-base">待进行信息核验</p>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  系统将从证照一致性、材料完整性、信息有效性三个维度进行全面核验，
                  {allCertsRead ? '点击右上角「开始核验」按钮进行核验' : '请先完成 4 份证照的读取操作'}
                </p>
                <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileCheck2 className="h-4 w-4" /> 证件一致性
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <ClipboardCheck className="h-4 w-4" /> 材料完整性
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Fingerprint className="h-4 w-4" /> 信息有效性
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  if (verifyStatus === 'verifying') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Spin size="large" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">正在核验中...</h3>
              <p className="text-sm text-slate-500">请稍候，正在进行多维度信息核验</p>
            </div>
          </div>
          <Progress
            type="circle"
            percent={60}
            size={48}
            status="active"
            strokeColor="#2563eb"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
              <ShieldCheck className="absolute inset-0 m-auto h-10 w-10 text-blue-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-slate-800">核验引擎运行中</p>
              <p className="text-sm text-slate-500">正在比对证照信息、校验数据有效性...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPassed = verifyStatus === 'passed';

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'flex items-center justify-between rounded-xl p-5 border-2',
          isPassed
            ? 'bg-gradient-to-r from-green-50 to-white border-green-200'
            : 'bg-gradient-to-r from-red-50 to-white border-red-200',
        )}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <StampIcon
              text={isPassed ? '核验通过' : '核验不通过'}
              variant={isPassed ? 'success' : 'danger'}
              size={110}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-800">
                {isPassed ? '信息核验通过' : '核验发现异常项'}
              </h3>
              <Tag
                color={isPassed ? 'success' : 'error'}
                className="!m-0 !text-sm !px-3 !py-1"
              >
                <span className="flex items-center gap-1">
                  {isPassed ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ShieldX className="h-4 w-4" />
                  )}
                  {isPassed ? '全部通过' : `${failedCount} 项不通过`}
                </span>
              </Tag>
            </div>
            <p className="text-sm text-slate-500 max-w-xl">
              {isPassed
                ? '所有核验项均已通过，证件信息完整有效，可进入下一步受理登记环节。'
                : '核验过程中发现不一致或异常项，请仔细核对相关信息，必要时人工复核证件原件。'}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="text-sm text-slate-500">通过率</div>
                <div className="w-40">
                  <Progress
                    percent={passRate}
                    size="small"
                    showInfo={false}
                    strokeColor={isPassed ? '#10b981' : '#ef4444'}
                  />
                </div>
                <div className="text-sm font-semibold text-slate-700">{passRate}%</div>
              </div>
              <div className="h-5 w-px bg-slate-200" />
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  通过 {passedCount}
                </span>
                {warningCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    警告 {warningCount}
                  </span>
                )}
                {failedCount > 0 && (
                  <span className="flex items-center gap-1 text-red-600">
                    <XCircle className="h-3.5 w-3.5" />
                    不通过 {failedCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={handleReset}
            className="!h-9"
          >
            重新核验
          </Button>
          {onReVerify && (
            <Button onClick={onReVerify} className="!h-9">
              重新读取证照
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={onNextStep}
            disabled={!isPassed}
            className="!h-9 !px-5"
          >
            进入受理登记
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {groupedDetails.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg',
                      categoryConfig[group.category].iconBg,
                    )}
                  >
                    {(() => {
                      const Icon = categoryConfig[group.category].icon;
                      return (
                        <Icon
                          className={cn(
                            'h-4 w-4',
                            categoryConfig[group.category].iconColor,
                          )}
                        />
                      );
                    })()}
                  </div>
                  <h4 className="font-semibold text-slate-700">{group.category}</h4>
                  <span className="text-xs text-slate-400">
                    共 {group.items.length} 项
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {group.items.map((item, idx) => (
                    <DetailItem key={item.id} item={item} index={idx} />
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
