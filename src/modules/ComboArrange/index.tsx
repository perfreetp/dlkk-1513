import SceneSelector from './SceneSelector';
import ItemMatrix from './ItemMatrix';
import NoticePreview from './NoticePreview';
import CountdownTimer from './CountdownTimer';
import { useComboArrangeStore } from '@/store/comboArrangeStore';
import {
  Workflow,
  LayoutGrid,
  FileCheck2,
  Timer,
  Settings2,
  Save,
  Send,
  ChevronRight,
  Clock,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Button, Steps, Tag, Divider, message, Modal, Alert } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const stepList = [
  { title: '选择情形', icon: <Workflow className="w-5 h-5" /> },
  { title: '组合事项', icon: <LayoutGrid className="w-5 h-5" /> },
  { title: '确认告知', icon: <FileCheck2 className="w-5 h-5" /> },
];

export default function ComboArrangeModule() {
  const {
    selectedItemIds,
    itemList,
    selectedSceneId,
    applicant,
    hasDraft,
    draftSavedAt,
    saveDraft,
    loadDraft,
    clearDraft,
  } = useComboArrangeStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDraftNotice, setShowDraftNotice] = useState(false);

  useEffect(() => {
    if (hasDraft && draftSavedAt) {
      setShowDraftNotice(true);
    }
  }, [hasDraft, draftSavedAt]);

  const handleSaveDraft = () => {
    if (selectedItemIds.length === 0) {
      message.warning('请至少选择一个联办事项');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      saveDraft();
      setSaving(false);
      message.success(
        `草稿已保存！保存时间：${dayjs(draftSavedAt || new Date()).format('YYYY-MM-DD HH:mm:ss')}`,
      );
    }, 500);
  };

  const handleRestoreDraft = () => {
    const success = loadDraft();
    if (success) {
      message.success('草稿已恢复！您可以继续编辑上次的内容');
      setShowDraftNotice(false);
    } else {
      message.error('草稿恢复失败，请检查本地存储');
    }
  };

  const handleDiscardDraft = () => {
    Modal.confirm({
      title: '确认放弃草稿？',
      icon: <AlertCircle className="text-amber-500" />,
      content: `该草稿保存于 ${dayjs(draftSavedAt).format('YYYY-MM-DD HH:mm:ss')}，放弃后将无法恢复`,
      okText: '确认放弃',
      okButtonProps: { danger: true },
      cancelText: '保留草稿',
      onOk: () => {
        clearDraft();
        setShowDraftNotice(false);
        message.info('已放弃草稿');
      },
    });
  };

  const selectedCount = selectedItemIds.length;
  const requiredCount = itemList.filter((i) => i.required).length;
  const totalMaterialCount = itemList
    .filter((i) => selectedItemIds.includes(i.id))
    .reduce((sum, i) => sum + i.materialCount, 0);
  const canProceed = selectedCount >= requiredCount;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      message.success(
        `联办受理成功！办件编号：CS-2026-0618-${Math.floor(1000 + Math.random() * 9000)}`
      );
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E40AF]/10 flex items-center justify-center border border-[#1E40AF]/20">
              <Workflow className="w-5 h-5 text-[#1E40AF]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">联办事项编排</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                根据办事场景自动组合多部门联办事项，生成一次告知单
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag color="blue" className="!rounded-full !px-3 !text-xs font-medium">
              申请人：{applicant.name}
            </Tag>
            <Tag color="green" className="!rounded-full !px-3 !text-xs font-medium">
              新生儿：{applicant.babyName}
            </Tag>
            <Button
              size="small"
              icon={<Settings2 className="w-3.5 h-3.5" />}
              className="!rounded-lg"
            >
              配置
            </Button>
          </div>
        </div>

        {showDraftNotice && (
          <div className="px-6 pt-2">
            <Alert
              type="info"
              showIcon
              icon={<Clock className="w-4 h-4" />}
              message={
                <div className="flex items-center justify-between">
                  <span>
                    检测到草稿（保存于{' '}
                    {dayjs(draftSavedAt).format('YYYY-MM-DD HH:mm')}
                    ），是否继续编辑上次的内容？
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                      onClick={handleRestoreDraft}
                      type="primary"
                    >
                      恢复草稿
                    </Button>
                    <Button size="small" onClick={handleDiscardDraft} danger>
                      放弃
                    </Button>
                  </div>
                </div>
              }
            />
          </div>
        )}

        <div className="px-6 pt-4 pb-2">
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            size="small"
            items={stepList.map((s) => ({
              title: s.title,
              icon: s.icon,
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Workflow className="w-4 h-4 text-[#1E40AF]" />
                第一步：选择办理情形
              </div>
              {selectedSceneId && (
                <Tag color="green" className="!rounded-full !m-0">
                  ✓ 已选择方案
                </Tag>
              )}
            </div>
            <div className="gov-card-body">
              <SceneSelector />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <LayoutGrid className="w-4 h-4 text-[#1E40AF]" />
                第二步：事项组合矩阵
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">
                  必选 <span className="text-amber-600 font-bold">{requiredCount}</span> 项，已选{' '}
                  <span className="text-[#1E40AF] font-bold">{selectedCount}</span> 项，材料{' '}
                  <span className="text-emerald-600 font-bold">{totalMaterialCount}</span> 份
                </span>
              </div>
            </div>
            <div className="gov-card-body">
              <ItemMatrix />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <FileCheck2 className="w-4 h-4 text-[#1E40AF]" />
                第三步：一次告知单预览
              </div>
              <span className="text-xs text-slate-400">
                请核对信息无误后生成正式告知单
              </span>
            </div>
            <div className="gov-card-body bg-slate-50/50 overflow-x-auto">
              <NoticePreview />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-body flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                  <span className="font-semibold text-slate-700">{selectedCount}</span> 项联办
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>
                  <span className="font-semibold text-slate-700">{totalMaterialCount}</span> 份材料
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>
                  <span className="font-semibold text-slate-700">4</span> 个部门协同
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="large"
                  className="!rounded-lg !h-11 !px-6"
                  icon={<Save className="w-4 h-4" />}
                  loading={saving}
                  onClick={handleSaveDraft}
                >
                  保存草稿
                  {hasDraft && (
                    <span className="ml-1 text-xs text-emerald-600">
                      · 已有草稿
                    </span>
                  )}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<Send className="w-4 h-4" />}
                  loading={submitting}
                  disabled={!canProceed}
                  onClick={handleSubmit}
                  className="!rounded-lg !h-11 !px-8"
                  style={{ backgroundColor: '#1E40AF' }}
                >
                  确认受理并打印告知单
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6 sticky top-6 h-fit">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Timer className="w-4 h-4 text-[#1E40AF]" />
                受理计时器
              </div>
            </div>
            <div className="gov-card-body">
              <CountdownTimer />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">联办概览</div>
            </div>
            <div className="gov-card-body space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <div className="text-2xl font-black text-[#1E40AF]">{selectedCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">联办事项数</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-600">{totalMaterialCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">材料总份数</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <div className="text-2xl font-black text-amber-600">4</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">涉及部门</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                  <div className="text-2xl font-black text-purple-600">30</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">工作日办结</div>
                </div>
              </div>
              <Divider className="!my-3" />
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-600 mb-2">已选事项</div>
                {itemList
                  .filter((i) => selectedItemIds.includes(i.id))
                  .map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] shrink-0" />
                      <span className="text-slate-700 font-medium flex-1 truncate">{i.name}</span>
                      <span className="text-slate-400">{i.timeLimit}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
