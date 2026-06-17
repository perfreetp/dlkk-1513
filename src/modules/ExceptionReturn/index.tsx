import { Row, Col, Button, Space, Tag, message, Modal } from 'antd';
import {
  Undo2,
  Send,
  Save,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import ExceptionTypes from './ExceptionTypes';
import ReasonTemplates from './ReasonTemplates';
import ReviewSubmit from './ReviewSubmit';
import ReturnTimeline from './ReturnTimeline';
import { useExceptionReturnStore } from '@/store/exceptionReturnStore';
import PageLayout from '@/components/layout/PageLayout';

export default function ExceptionReturn() {
  const {
    selectedExceptionType,
    selectedTemplateId,
    customRemark,
    reasonTemplates,
    exceptionTypes,
    caseNumber,
    applicantName,
  } = useExceptionReturnStore();

  const [submitting, setSubmitting] = useState(false);

  const selectedException = exceptionTypes.find(
    (e) => e.key === selectedExceptionType,
  );
  const selectedTemplate = reasonTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  const canSubmit = !!selectedExceptionType && (!!selectedTemplateId || !!customRemark);

  const handleSubmit = () => {
    if (!canSubmit) {
      message.warning('请完成异常分类和退回原因的选择');
      return;
    }

    Modal.confirm({
      title: '确认提交退件申请？',
      icon: <AlertTriangle className="text-amber-500" />,
      content: (
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">异常类型：</span>
            <Tag color="red">{selectedException?.name}</Tag>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 text-slate-500">退回原因：</span>
            <div className="flex-1 text-slate-700">
              {selectedTemplate?.content}
              {customRemark && (
                <div className="mt-1 rounded bg-blue-50 px-2 py-1 text-blue-700">
                  补充：{customRemark}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      okText: '确认提交',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitting(false);
        message.success('退件申请已成功提交，等待部门审核');
      },
    });
  };

  const handleSaveDraft = () => {
    message.success('草稿已保存');
  };

  return (
    <PageLayout
      title="异常退回处理"
      subtitle="对异常办件进行分类、退回原因填写、复核及流转跟踪"
      breadcrumb={[
        { title: '首页' },
        { title: '办件管理' },
        { title: '异常退回' },
      ]}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 px-5 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Undo2 size={18} className="text-rose-500" />
            <span className="font-semibold text-slate-800">退件处理</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <span className="text-slate-500">办件编号：</span>
            <span className="font-mono font-semibold text-slate-800">
              {caseNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500">申请人：</span>
            <span className="font-semibold text-slate-800">{applicantName}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Space size={12}>
            <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
              <Info size={12} />
              标 * 为必填项
            </div>
          </Space>
          <Button
            icon={<Save size={14} />}
            onClick={handleSaveDraft}
          >
            保存草稿
          </Button>
          <Button
            type="primary"
            danger
            icon={<Send size={14} />}
            loading={submitting}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-gradient-to-r from-rose-600 to-red-600"
          >
            提交退件
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="h-[460px]">
                <ExceptionTypes />
              </div>
            </Col>
            <Col span={24}>
              <div className="h-[calc(100vh-460px-220px)] min-h-[420px]">
                <ReasonTemplates />
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} xl={12}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div className="h-[420px]">
                <ReviewSubmit />
              </div>
            </Col>
            <Col span={24}>
              <div className="h-[calc(100vh-420px-220px)] min-h-[460px]">
                <ReturnTimeline />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </PageLayout>
  );
}
