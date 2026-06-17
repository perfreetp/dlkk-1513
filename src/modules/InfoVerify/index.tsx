import { Steps, Card, Row, Col, Statistic, Tag, message } from 'antd';
import {
  ScanLine,
  ArrowRightLeft,
  ShieldCheck,
  Baby,
  User,
  UserRound,
  HeartHandshake,
  FileCheck2,
  ClipboardCheck,
  Fingerprint,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import CertReader from './CertReader';
import CompareTable from './CompareTable';
import VerifyResult from './VerifyResult';
import { useVerifyStore } from '@/store/verifyStore';
import { cn } from '@/lib/utils';
import PageLayout from '@/components/layout/PageLayout';

interface InfoVerifyProps {
  className?: string;
}

const steps = [
  {
    key: 0,
    title: '证照读取',
    description: '扫描并读取 4 份证照',
    icon: ScanLine,
  },
  {
    key: 1,
    title: '信息比对',
    description: '电子证照与OCR结果比对',
    icon: ArrowRightLeft,
  },
  {
    key: 2,
    title: '核验结果',
    description: '多维度综合核验',
    icon: ShieldCheck,
  },
];

export default function InfoVerify({ className }: InfoVerifyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { certs, verifyStatus, resetAllCerts, resetVerify } = useVerifyStore();

  const allCertsRead = Object.values(certs).every((c) => c.status === 'success');
  const successCount = Object.values(certs).filter((c) => c.status === 'success').length;
  const hasCompareData = verifyStatus !== 'pending' || allCertsRead;

  const canGoNext = (step: number) => {
    if (step === 0) return allCertsRead;
    if (step === 1) return hasCompareData;
    return true;
  };

  const handleStepClick = (step: number) => {
    if (step === 0) {
      setCurrentStep(0);
    } else if (step === 1 && canGoNext(0)) {
      setCurrentStep(1);
    } else if (step === 2 && canGoNext(1)) {
      setCurrentStep(2);
    } else if (!canGoNext(step)) {
      if (step === 1) {
        message.warning('请先完成所有证照的读取操作');
      } else if (step === 2) {
        message.warning('请先完成证照读取和信息比对');
      }
    }
  };

  const handleReReadCerts = () => {
    resetAllCerts();
    resetVerify();
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const statsCards = [
    {
      title: '出生医学证明',
      icon: Baby,
      status: certs.birthCert.status,
      color: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        icon: 'text-pink-600',
        iconBg: 'bg-pink-100',
      },
    },
    {
      title: '父亲身份证',
      icon: User,
      status: certs.fatherIdCard.status,
      color: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
      },
    },
    {
      title: '母亲身份证',
      icon: UserRound,
      status: certs.motherIdCard.status,
      color: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        icon: 'text-rose-600',
        iconBg: 'bg-rose-100',
      },
    },
    {
      title: '结婚证',
      icon: HeartHandshake,
      status: certs.marriageCert.status,
      color: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
      },
    },
  ];

  const statIcons = [FileCheck2, ClipboardCheck, Fingerprint];
  const verifyCategoryStats =
    verifyStatus !== 'pending' && verifyStatus !== 'verifying'
      ? [
          {
            name: '证件一致性',
            total: 4,
            passed: 3,
          },
          {
            name: '材料完整性',
            total: 1,
            passed: 1,
          },
          {
            name: '信息有效性',
            total: 3,
            passed: 3,
          },
        ]
      : null;

  return (
    <PageLayout
      className={className}
      title="信息核验"
      subtitle="出生一件事联办工作台 · 证照读取与信息核验"
      activeNav="info-verify"
      breadcrumb={[
        { title: '首页' },
        { title: '工作台' },
        { title: '信息核验' },
      ]}
    >
      <div className="flex h-full flex-col gap-5">
        <Card
          className="!rounded-xl !border-slate-200 overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <div className="p-6">
            <Steps
              current={currentStep}
              onChange={handleStepClick}
              items={steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStep || (idx === 0 && allCertsRead);
                return {
                  title: (
                    <span className="font-medium text-slate-700">{step.title}</span>
                  ),
                  description: (
                    <span className="text-xs text-slate-400">{step.description}</span>
                  ),
                  icon: (
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                        currentStep === idx
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200'
                          : isCompleted
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-slate-200 bg-white text-slate-400',
                      )}
                    >
                      {isCompleted && currentStep !== idx ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                  ),
                  status:
                    currentStep === idx
                      ? 'process'
                      : isCompleted
                        ? 'finish'
                        : 'wait',
                };
              })}
              className="[&_.ant-steps-item-title]:!leading-tight [&_.ant-steps-item]:!py-0"
            />
          </div>
        </Card>

        <Row gutter={16}>
          {statsCards.map((stat, idx) => {
            const StatIcon = stat.icon;
            const statusTag =
              stat.status === 'success'
                ? { color: 'success' as const, text: '已读取', icon: CheckCircle2 }
                : stat.status === 'reading'
                  ? { color: 'processing' as const, text: '读取中', icon: AlertCircle }
                  : stat.status === 'failed'
                    ? { color: 'error' as const, text: '读取失败', icon: XCircle }
                    : { color: 'default' as const, text: '待读取', icon: AlertCircle };
            const StatusTagIcon = statusTag.icon;
            return (
              <Col xs={12} sm={6} key={idx}>
                <Card
                  className={cn(
                    '!rounded-xl !border-2 transition-all',
                    stat.color.border,
                    stat.status === 'success' ? '!bg-gradient-to-br from-white to-green-50' : '',
                  )}
                  styles={{ body: { padding: 16 } }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        stat.color.iconBg,
                      )}
                    >
                      <StatIcon className={cn('h-5 w-5', stat.color.icon)} />
                    </div>
                    <Tag
                      color={statusTag.color}
                      className="!m-0 !text-xs"
                      icon={<StatusTagIcon className="h-3 w-3" />}
                    >
                      {statusTag.text}
                    </Tag>
                  </div>
                  <Statistic
                    title={<span className="text-sm text-slate-500">{stat.title}</span>}
                    value={stat.status === 'success' ? 'OK' : stat.status === 'failed' ? 'X' : '--'}
                    valueStyle={{
                      color:
                        stat.status === 'success'
                          ? '#059669'
                          : stat.status === 'failed'
                            ? '#dc2626'
                            : '#94a3b8',
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>

        {verifyCategoryStats && currentStep === 2 && (
          <Row gutter={16}>
            {verifyCategoryStats.map((cat, idx) => {
              const CatIcon = statIcons[idx];
              return (
                <Col xs={24} sm={8} key={idx}>
                  <Card
                    className="!rounded-xl !border-slate-200"
                    styles={{ body: { padding: 16 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                        <CatIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 mb-0.5">{cat.name}</p>
                        <p className="text-lg font-bold text-slate-800">
                          <span className="text-green-600">{cat.passed}</span>
                          <span className="text-slate-400 text-base font-normal mx-1">
                            /
                          </span>
                          <span className="text-slate-500 text-base font-normal">
                            {cat.total}
                          </span>
                          <span className="text-sm text-slate-400 font-normal ml-1">项</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-bold text-green-600">
                          {Math.round((cat.passed / cat.total) * 100)}%
                        </span>
                        <span className="text-xs text-slate-400">通过率</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <Card
          className={cn(
            'flex-1 min-h-0 !rounded-xl !border-slate-200 flex flex-col overflow-hidden',
          )}
          styles={{
            body: {
              padding: 0,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            },
          }}
          headStyle={{
            padding: '12px 20px',
            borderBottom: '1px solid #e2e8f0',
          }}
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    currentStep === 0
                      ? 'bg-blue-100'
                      : currentStep === 1
                        ? 'bg-indigo-100'
                        : 'bg-green-100',
                  )}
                >
                  {currentStep === 0 ? (
                    <ScanLine className="h-4 w-4 text-blue-600" />
                  ) : currentStep === 1 ? (
                    <ArrowRightLeft className="h-4 w-4 text-indigo-600" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="font-semibold text-slate-800">
                  {steps[currentStep].title}
                </span>
                {currentStep === 0 && (
                  <Tag color="blue" className="ml-2 !m-0">
                    {successCount}/4 份已读取
                  </Tag>
                )}
              </div>
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-sm text-slate-500 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    ← 上一步
                  </button>
                )}
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={handleNextStep}
                    disabled={!canGoNext(currentStep)}
                    className={cn(
                      'text-sm px-3 py-1.5 rounded-lg transition-all',
                      canGoNext(currentStep)
                        ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm'
                        : 'text-slate-400 bg-slate-100 cursor-not-allowed',
                    )}
                  >
                    下一步 →
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="p-5 overflow-y-auto flex-1 min-h-0">
            {currentStep === 0 && <CertReader />}
            {currentStep === 1 && <CompareTable />}
            {currentStep === 2 && (
              <VerifyResult
                onReVerify={handleReReadCerts}
                onNextStep={() => {
                  message.success('核验通过，即将进入受理登记环节');
                }}
              />
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
