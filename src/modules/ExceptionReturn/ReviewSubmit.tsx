import { useState } from 'react';
import {
  Card,
  Form,
  Select,
  Input,
  Upload,
  Button,
  Table,
  Tag,
  Space,
  Tooltip,
  message,
  Popconfirm,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  FileCheck2,
  Paperclip,
  Send,
  RotateCcw,
  History,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useExceptionReturnStore,
  type ReviewRecord,
} from '@/store/exceptionReturnStore';

const { TextArea } = Input;

export default function ReviewSubmit() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const {
    reviewForm,
    setReviewForm,
    resetReviewForm,
    addReviewRecord,
    reviewHistory,
    addAttachment,
    removeAttachment,
    selectedTemplateId,
    reasonTemplates,
    customRemark,
    selectedExceptionType,
    exceptionTypes,
  } = useExceptionReturnStore();

  const selectedTemplate = reasonTemplates.find(
    (t) => t.id === selectedTemplateId,
  );
  const selectedException = exceptionTypes.find(
    (e) => e.key === selectedExceptionType,
  );

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    addAttachment(file.name);
    message.success(`附件 ${file.name} 已添加`);
    return false;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedExceptionType) {
        message.warning('请先选择异常分类');
        return;
      }
      if (!selectedTemplateId && !customRemark) {
        message.warning('请选择退回原因模板或填写补充说明');
        return;
      }

      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));

      addReviewRecord({
        reviewType: values.reviewType,
        reviewer: values.reviewer,
        opinion: values.opinion,
        attachments: [...reviewForm.attachments],
        result: 'passed',
      });

      message.success('复核提交成功！');
      resetReviewForm();
      form.resetFields();
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    resetReviewForm();
    message.info('表单已重置');
  };

  const reviewColumns = [
    {
      title: '复核类型',
      dataIndex: 'reviewType',
      key: 'reviewType',
      width: 110,
      render: (text: string) => (
        <Tag color="blue" className="m-0 whitespace-nowrap">
          {text}
        </Tag>
      ),
    },
    {
      title: '复核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 100,
      render: (text: string) => (
        <span className="flex items-center gap-1.5">
          <User size={13} className="text-slate-400" />
          {text}
        </span>
      ),
    },
    {
      title: '复核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
      width: 170,
      render: (text: string) => (
        <span className="flex items-center gap-1.5 text-slate-500">
          <Calendar size={13} />
          {text}
        </span>
      ),
    },
    {
      title: '复核意见',
      dataIndex: 'opinion',
      key: 'opinion',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-slate-700">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachments',
      key: 'attachments',
      width: 120,
      render: (files: string[]) =>
        files.length > 0 ? (
          <Space size={4} wrap>
            {files.map((f, i) => (
              <Tooltip title={`下载 ${f}`} key={i}>
                <Button
                  type="link"
                  size="small"
                  icon={<Download size={12} />}
                  className="!h-auto !p-0 !px-1"
                >
                  {f.length > 8 ? f.slice(0, 8) + '...' : f}
                </Button>
              </Tooltip>
            ))}
          </Space>
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 90,
      align: 'center' as const,
      render: (result: string) =>
        result === 'passed' ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <CheckCircle size={12} />
            通过
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
            <XCircle size={12} />
            驳回
          </span>
        ),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <Card
        title={
          <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <FileCheck2 size={18} className="text-primary-600" />
            复核提交
          </div>
        }
        size="small"
      >
        <div className="mb-4 rounded-lg border border-dashed border-primary-300 bg-primary-50/50 p-3">
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">异常类型：</span>
              {selectedException ? (
                <Tag color="red" className="m-0">
                  {selectedException.name}
                </Tag>
              ) : (
                <span className="text-slate-400">未选择</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">退回原因：</span>
              {selectedTemplate ? (
                <span className="text-slate-700">
                  {selectedTemplate.title.length > 15
                    ? selectedTemplate.title.slice(0, 15) + '...'
                    : selectedTemplate.title}
                </span>
              ) : customRemark ? (
                <span className="text-slate-700">自定义说明</span>
              ) : (
                <span className="text-slate-400">未选择</span>
              )}
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            reviewType: '',
            reviewer: '',
            opinion: '',
          }}
          onValuesChange={(changed) => setReviewForm(changed)}
          size="middle"
        >
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item
              label="复核类型"
              name="reviewType"
              rules={[{ required: true, message: '请选择复核类型' }]}
            >
              <Select
                placeholder="请选择复核类型"
                options={[
                  { label: '一级复核', value: '一级复核' },
                  { label: '二级复核', value: '二级复核' },
                  { label: '终审复核', value: '终审复核' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="复核人"
              name="reviewer"
              rules={[{ required: true, message: '请输入复核人姓名' }]}
            >
              <Input
                prefix={<User size={14} className="text-slate-400" />}
                placeholder="请输入复核人姓名"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="复核意见"
            name="opinion"
            rules={[{ required: true, message: '请填写复核意见' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入复核意见，说明复核结论及依据..."
              className="resize-none"
              count={{ show: true, max: 300 }}
            />
          </Form.Item>

          <Form.Item label="附件上传" className="mb-2">
            <Upload
              multiple
              beforeUpload={beforeUpload}
              showUploadList={false}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            >
              <Button icon={<Paperclip size={14} />} className="w-full">
                点击上传附件（支持 PDF、Word、图片，最多 10 个）
              </Button>
            </Upload>
            {reviewForm.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {reviewForm.attachments.map((f, i) => (
                  <span
                    key={i}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700',
                    )}
                  >
                    <FileText size={12} className="text-slate-400" />
                    {f}
                    <button
                      onClick={() => removeAttachment(i)}
                      className="ml-1 text-slate-400 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Form.Item>
        </Form>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <Popconfirm
            title="确定要重置表单吗？"
            description="已填写的内容将被清空"
            onConfirm={handleReset}
            okText="确定"
            cancelText="取消"
          >
            <Button icon={<RotateCcw size={14} />}>重置</Button>
          </Popconfirm>
          <Button
            type="primary"
            icon={<Send size={14} />}
            loading={submitting}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-primary-600 to-primary-700"
          >
            提交复核
          </Button>
        </div>
      </Card>

      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <History size={18} className="text-primary-600" />
              历史复核记录
            </span>
            <Tag color="green" className="m-0">
              共 {reviewHistory.length} 条
            </Tag>
          </div>
        }
        size="small"
        className="flex-1"
        styles={{ body: { padding: 0 } }}
      >
        <Table<ReviewRecord>
          dataSource={reviewHistory}
          columns={reviewColumns}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ y: 220 }}
          className="[&_.ant-table-thead_.ant-table-cell]:!bg-slate-50 [&_.ant-table-thead_.ant-table-cell]:!text-xs [&_.ant-table-thead_.ant-table-cell]:!font-semibold [&_.ant-table-thead_.ant-table-cell]:!text-slate-600"
        />
      </Card>
    </div>
  );
}
