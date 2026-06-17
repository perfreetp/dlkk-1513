import { Button, Progress, Tag, Tooltip } from 'antd';
import {
  ScanLine,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  FileText,
  User,
  UserRound,
  HeartHandshake,
} from 'lucide-react';
import { useVerifyStore, type CertType, type CertItem } from '@/store/verifyStore';
import { cn } from '@/lib/utils';

const certIcons: Record<CertType, React.ComponentType<{ className?: string }>> = {
  birthCert: FileText,
  fatherIdCard: User,
  motherIdCard: UserRound,
  marriageCert: HeartHandshake,
};

const certColors: Record<CertType, { bg: string; icon: string; border: string; progress: string }> = {
  birthCert: {
    bg: 'bg-pink-50',
    icon: 'text-pink-600',
    border: 'border-pink-200',
    progress: '#ec4899',
  },
  fatherIdCard: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-200',
    progress: '#2563eb',
  },
  motherIdCard: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    border: 'border-rose-200',
    progress: '#e11d48',
  },
  marriageCert: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-200',
    progress: '#9333ea',
  },
};

const statusConfig = {
  pending: { label: '待读取', tagColor: 'default' as const, icon: Clock, iconClass: 'text-slate-400' },
  reading: { label: '读取中', tagColor: 'processing' as const, icon: RefreshCw, iconClass: 'text-blue-500 animate-spin' },
  success: { label: '读取成功', tagColor: 'success' as const, icon: CheckCircle2, iconClass: 'text-green-500' },
  failed: { label: '读取失败', tagColor: 'error' as const, icon: XCircle, iconClass: 'text-red-500' },
  skipped: { label: '已跳过', tagColor: 'default' as const, icon: AlertCircle, iconClass: 'text-slate-400' },
};

interface CertCardProps {
  cert: CertItem;
  onRead: () => void;
  onRetry: () => void;
  disabled: boolean;
}

function CertCard({ cert, onRead, onRetry, disabled }: CertCardProps) {
  const Icon = certIcons[cert.type];
  const colors = certColors[cert.type];
  const status = statusConfig[cert.status];
  const StatusIcon = status.icon;

  const isActionable = cert.status === 'pending' || cert.status === 'failed';
  const showProgress = cert.status === 'reading';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border-2 bg-white p-4 transition-all duration-300',
        colors.border,
        cert.status === 'reading' && 'ring-2 ring-blue-300 ring-offset-2 shadow-lg',
        cert.status === 'success' && 'shadow-sm',
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
            colors.bg,
            cert.status === 'reading' && 'animate-pulse',
          )}
        >
          <Icon className={cn('h-7 w-7', colors.icon)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-slate-800">{cert.name}</h4>
              <div className="mt-0.5 flex items-center gap-2">
                <Tag color={status.tagColor} className="!m-0 !text-xs">
                  <span className="flex items-center gap-1">
                    <StatusIcon className={cn('h-3 w-3', status.iconClass)} />
                    {status.label}
                  </span>
                </Tag>
              </div>
            </div>

            {isActionable && (
              <Tooltip title={cert.status === 'failed' ? '重新读取' : '开始读取'}>
                <Button
                  type={cert.status === 'failed' ? 'default' : 'primary'}
                  size="small"
                  icon={cert.status === 'failed' ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  onClick={cert.status === 'failed' ? onRetry : onRead}
                  disabled={disabled}
                  danger={cert.status === 'failed'}
                  className="!h-8"
                >
                  {cert.status === 'failed' ? '重试' : '读取'}
                </Button>
              </Tooltip>
            )}
          </div>

          {showProgress && (
            <Progress
              percent={cert.progress}
              status="active"
              size="small"
              strokeColor={colors.progress}
              showInfo
              className="[&_.ant-progress-text]:!text-xs [&_.ant-progress-text]:!text-slate-500"
            />
          )}

          {cert.status === 'failed' && cert.errorMsg && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {cert.errorMsg}
            </p>
          )}

          {cert.status === 'success' && cert.electronicData && (
            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              已获取 {Object.keys(cert.electronicData).length} 项证照信息
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface CertReaderProps {
  className?: string;
}

export default function CertReader({ className }: CertReaderProps) {
  const { certs, overallProgress, readAllCerts, readSingleCert, resetAllCerts } = useVerifyStore();

  const isReading = Object.values(certs).some((c) => c.status === 'reading');
  const allSuccess = Object.values(certs).every((c) => c.status === 'success');
  const successCount = Object.values(certs).filter((c) => c.status === 'success').length;
  const hasAnyStarted = Object.values(certs).some((c) => c.status !== 'pending');

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <ScanLine className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">证照读取</h3>
            <p className="text-sm text-slate-500">
              已完成 {successCount}/4 份证照 · 整体进度 {overallProgress}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasAnyStarted && (
            <Button
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={resetAllCerts}
              disabled={isReading}
              className="!h-9"
            >
              重置
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            icon={<ScanLine className="h-4 w-4" />}
            onClick={readAllCerts}
            disabled={isReading || allSuccess}
            loading={isReading}
            className="!h-9 !px-5"
          >
            {allSuccess ? '全部完成' : isReading ? '读取中...' : '一键全部读取'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(Object.keys(certs) as CertType[]).map((type) => (
          <CertCard
            key={type}
            cert={certs[type]}
            onRead={() => readSingleCert(type)}
            onRetry={() => readSingleCert(type)}
            disabled={isReading}
          />
        ))}
      </div>

      {isReading && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            <span className="font-medium text-blue-700">正在读取证照信息...</span>
            <span className="ml-auto text-sm text-blue-600 font-medium">{overallProgress}%</span>
          </div>
          <Progress
            percent={overallProgress}
            status="active"
            strokeColor="#2563eb"
            showInfo={false}
          />
        </div>
      )}
    </div>
  );
}
