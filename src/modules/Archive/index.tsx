import { Row, Col, Button, Tag, message, Modal, Progress, Statistic } from 'antd';
import {
  Archive,
  FileCheck2,
  FolderOpen,
  Send,
  Save,
  CheckCircle,
  AlertTriangle,
  FileUp,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import DualRegister from './DualRegister';
import MaterialUpload from './MaterialUpload';
import FlowVisualize from './FlowVisualize';
import ELicenseBind from './ELicenseBind';
import { useArchiveStore } from '@/store/archiveStore';
import PageLayout from '@/components/layout/PageLayout';

export default function ArchiveIndex() {
  const {
    caseNumber,
    applicantName,
    materials,
    licenses,
    flowSteps,
    paperForm,
    electronicForm,
    registerType,
  } = useArchiveStore();

  const [archiving, setArchiving] = useState(false);

  const boundLicenseCount = useMemo(
    () => licenses.filter((l) => l.bound).length,
    [licenses],
  );

  const completedFlowCount = useMemo(
    () => flowSteps.filter((s) => s.status === 'completed').length,
    [flowSteps],
  );

  const isPaperReady = useMemo(
    () =>
      paperForm.boxNo &&
      paperForm.location &&
      paperForm.binder &&
      paperForm.bindDate,
    [paperForm],
  );

  const isElectronicReady = useMemo(
    () =>
      electronicForm.eArchiveNo &&
      electronicForm.storagePath &&
      electronicForm.archivist &&
      electronicForm.archiveDate,
    [electronicForm],
  );

  const archivableItems = [
    {
      key: 'materials',
      name: '归档材料',
      value: materials.length,
      min: 1,
      unit: '份',
      done: materials.length > 0,
      icon: FileUp,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      key: 'licenses',
      name: '证照绑定',
      value: boundLicenseCount,
      min: 1,
      unit: '张',
      done: boundLicenseCount >= 1,
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'paper',
      name: '纸质登记',
      value: isPaperReady ? 1 : 0,
      min: 1,
      unit: '项',
      done: isPaperReady,
      icon: FolderOpen,
      color: 'from-amber-500 to-orange-500',
    },
    {
      key: 'electronic',
      name: '电子登记',
      value: isElectronicReady ? 1 : 0,
      min: 1,
      unit: '项',
      done: isElectronicReady,
      icon: FolderOpen,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const doneCount = archivableItems.filter((i) => i.done).length;
  const totalToDo = archivableItems.length;
  const canArchive = doneCount === totalToDo;
  const progressPercent = Math.round((doneCount / totalToDo) * 100);

  const handleArchive = () => {
    if (!canArchive) {
      message.warning('请完成所有归档前置条件');
      return;
    }

    Modal.confirm({
      title: '确认完成办结归档？',
      icon: <AlertTriangle className="text-amber-500" />,
      content: (
        <div className="mt-2 space-y-2 text-sm">
          <div className="rounded-lg border border-primary-200 bg-primary-50/50 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500">办件编号：</span>
                <span className="font-mono font-semibold text-slate-800">
                  {caseNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500">申请人：</span>
                <span className="font-semibold text-slate-800">
                  {applicantName}
                </span>
              </div>
              <div>
                <span className="text-slate-500">归档材料：</span>
                <span className="font-semibold text-slate-800">
                  {materials.length} 份
                </span>
              </div>
              <div>
                <span className="text-slate-500">绑定证照：</span>
                <span className="font-semibold text-slate-800">
                  {boundLicenseCount} 张
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">办结流程：</span>
                <span className="font-semibold text-slate-800">
                  {completedFlowCount}/{flowSteps.length} 个节点已完成
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-600">
            归档完成后，本办件将标记为"已办结归档"，相关数据将不可随意修改。
          </p>
        </div>
      ),
      okText: '确认归档',
      cancelText: '取消',
      okButtonProps: {
        type: 'primary',
        className: 'bg-gradient-to-r from-primary-600 to-primary-700',
      },
      onOk: async () => {
        setArchiving(true);
        await new Promise((r) => setTimeout(r, 1500));
        setArchiving(false);
        message.success(
          `办件 ${caseNumber} 归档成功！所有数据已同步至档案管理系统`,
        );
      },
    });
  };

  const handleSaveDraft = () => {
    message.success('归档草稿已保存');
  };

  return (
    <PageLayout
      title="办结归档"
      subtitle="办件完成后进行材料整理、证照绑定、双登记及归档操作"
      breadcrumb={[
        { title: '首页' },
        { title: '办件管理' },
        { title: '办结归档' },
      ]}
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50/50 to-white px-6 py-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
                <Archive size={20} />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">
                  办结归档
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                  <span>
                    办件号：
                    <span className="font-mono font-semibold text-slate-700">
                      {caseNumber}
                    </span>
                  </span>
                  <span>
                    申请人：
                    <span className="font-semibold text-slate-700">
                      {applicantName}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-4">
                <Statistic
                  title={<span className="text-xs text-slate-500">归档材料</span>}
                  value={materials.length}
                  suffix="份"
                  className="[&_.ant-statistic-content]:!text-sm [&_.ant-statistic-content-value]:!text-primary-600 [&_.ant-statistic-title]:!mb-0"
                />
                <div className="h-8 w-px bg-slate-200" />
                <Statistic
                  title={<span className="text-xs text-slate-500">绑定证照</span>}
                  value={boundLicenseCount}
                  suffix={`/${licenses.length}`}
                  className="[&_.ant-statistic-content]:!text-sm [&_.ant-statistic-content-value]:!text-emerald-600 [&_.ant-statistic-title]:!mb-0"
                />
                <div className="h-8 w-px bg-slate-200" />
                <Statistic
                  title={<span className="text-xs text-slate-500">流程节点</span>}
                  value={completedFlowCount}
                  suffix={`/${flowSteps.length}`}
                  className="[&_.ant-statistic-content]:!text-sm [&_.ant-statistic-content-value]:!text-blue-600 [&_.ant-statistic-title]:!mb-0"
                />
              </div>
            </div>

            <div className="w-40 shrink-0">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-slate-500">归档进度</span>
                <span className="font-semibold text-primary-600">
                  {progressPercent}%
                </span>
              </div>
              <Progress
                percent={progressPercent}
                size="small"
                showInfo={false}
                strokeColor={{
                  from: '#10b981',
                  to: '#2563eb',
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                icon={<Save size={14} />}
                onClick={handleSaveDraft}
              >
                保存草稿
              </Button>
              <Button
                type="primary"
                icon={canArchive ? <CheckCircle size={14} /> : <Send size={14} />}
                loading={archiving}
                onClick={handleArchive}
                disabled={!canArchive}
                className={
                  canArchive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-100'
                    : ''
                }
              >
                {canArchive ? '完成归档' : '完成归档'}
              </Button>
            </div>
          </div>
        </div>

        {!canArchive && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/60 px-4 py-2.5 text-xs">
            <AlertTriangle size={14} className="shrink-0 text-amber-600" />
            <span className="text-amber-800">
              完成归档前请确认：
            </span>
            {archivableItems.map((item, idx) => (
              <span key={item.key}>
                {idx > 0 && <span className="mx-1 text-amber-400">、</span>}
                <span
                  className={cn(
                    'font-medium',
                    item.done
                      ? 'text-emerald-700 line-through decoration-emerald-400'
                      : 'text-amber-700',
                  )}
                >
                  {item.name}
                  {item.done ? '（已完成）' : '（待完成）'}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="min-h-[380px]">
                <DualRegister />
              </div>
            </Col>
            <Col span={24}>
              <div className="min-h-[480px]">
                <MaterialUpload />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="min-h-[440px]">
                <FlowVisualize />
              </div>
            </Col>
            <Col span={24}>
              <div className="min-h-[420px]">
                <ELicenseBind />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </PageLayout>
  );
}
