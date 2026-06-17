import { useSupplementStore, type PriorityLevel, type SupplementItem } from '@/store/supplementStore';
import { Table, Tag, Button, Input, Select, DatePicker, Space, Popconfirm, message } from 'antd';
import {
  Plus,
  Trash2,
  ListChecks,
  AlertTriangle,
  Flag,
  CalendarDays,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

const priorityConfig: Record<PriorityLevel, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  高: {
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: '高优',
  },
  中: {
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <Flag className="w-3.5 h-3.5" />,
    label: '中优',
  },
  低: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <ListChecks className="w-3.5 h-3.5" />,
    label: '低优',
  },
};

export default function SupplementList() {
  const {
    supplementList,
    addSupplementItem,
    removeSupplementItem,
    updateSupplementItem,
    clearSupplementList,
    generateNoticeFromList,
  } = useSupplementStore();

  const highCount = supplementList.filter((i) => i.priority === '高').length;
  const urgentCount = supplementList.filter((i) => {
    if (!i.deadline) return false;
    const diff = dayjs(i.deadline).diff(dayjs(), 'day');
    return diff <= 2 && diff >= 0;
  }).length;

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: SupplementItem, idx: number) => (
        <span className="inline-flex items-center gap-1.5">
          <GripVertical className="w-3 h-3 text-slate-300 cursor-grab" />
          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-4 h-4 text-[#1E40AF]" />
          材料名称
        </div>
      ),
      key: 'materialName',
      width: 200,
      render: (_: unknown, record: SupplementItem) => (
        <div className="py-1">
          <Input
            size="small"
            value={record.materialName}
            onChange={(e) => updateSupplementItem(record.id, { materialName: e.target.value })}
            placeholder="请输入材料名称"
            className="!rounded-lg"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5">
          <Flag className="w-4 h-4 text-amber-500" />
          优先级
        </div>
      ),
      key: 'priority',
      width: 130,
      align: 'center' as const,
      render: (_: unknown, record: SupplementItem) => {
        const cfg = priorityConfig[record.priority];
        return (
          <div className="py-1">
            <Select
              size="small"
              value={record.priority}
              onChange={(v) => updateSupplementItem(record.id, { priority: v })}
              className="!w-full !rounded-lg"
              optionLabelProp="label"
              options={[
                {
                  value: '高',
                  label: <span className="text-red-600 font-medium">高优先级</span>,
                },
                {
                  value: '中',
                  label: <span className="text-amber-600 font-medium">中优先级</span>,
                },
                {
                  value: '低',
                  label: <span className="text-emerald-600 font-medium">低优先级</span>,
                },
              ]}
              suffixIcon={null}
              dropdownRender={(menu) => menu}
            >
            </Select>
            <div className="mt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border',
                  cfg.color,
                  cfg.bg
                )}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          补正要求说明
        </div>
      ),
      key: 'requirement',
      render: (_: unknown, record: SupplementItem) => (
        <div className="py-1">
          <Input.TextArea
            size="small"
            value={record.requirement}
            onChange={(e) => updateSupplementItem(record.id, { requirement: e.target.value })}
            placeholder="请输入补正要求说明..."
            rows={2}
            className="!rounded-lg resize-none"
          />
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-purple-500" />
          截止日期
        </div>
      ),
      key: 'deadline',
      width: 170,
      render: (_: unknown, record: SupplementItem) => {
        const isUrgent =
          record.deadline &&
          dayjs(record.deadline).diff(dayjs(), 'day') <= 2 &&
          dayjs(record.deadline).diff(dayjs(), 'day') >= 0;
        const isOverdue = record.deadline && dayjs(record.deadline).diff(dayjs(), 'day') < 0;
        return (
          <div className="py-1">
            <DatePicker
              size="small"
              value={record.deadline ? dayjs(record.deadline) : null}
              onChange={(d) =>
                updateSupplementItem(record.id, { deadline: d ? d.format('YYYY-MM-DD') : '' })
              }
              placeholder="截止日期"
              className="!w-full !rounded-lg"
              minDate={dayjs()}
            />
            <div className="mt-1">
              {record.deadline ? (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-semibold',
                    isOverdue && 'bg-red-100 text-red-700',
                    isUrgent && !isOverdue && 'bg-amber-100 text-amber-700',
                    !isUrgent && !isOverdue && 'bg-slate-100 text-slate-600'
                  )}
                >
                  <CalendarDays className="w-3 h-3" />
                  {record.deadline}
                </span>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: unknown, record: SupplementItem) => (
        <Popconfirm
          title="确认删除该补正项？"
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
          onConfirm={() => {
            removeSupplementItem(record.id);
            message.success('已删除补正项');
          }}
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<Trash2 className="w-4 h-4" />}
            className="!rounded-lg"
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-lg font-semibold text-slate-800">补正材料清单</h2>
          <Tag color="blue" className="!rounded-full !m-0 !text-xs font-medium">
            共 {supplementList.length} 项
          </Tag>
          {highCount > 0 && (
            <Tag color="red" className="!rounded-full !m-0 !text-xs font-medium">
              高优先 {highCount}
            </Tag>
          )}
          {urgentCount > 0 && (
            <Tag color="warning" className="!rounded-full !m-0 !text-xs font-medium">
              <AlertTriangle className="w-3 h-3 inline mr-0.5" />
              临近截止 {urgentCount}
            </Tag>
          )}
        </div>

        <Space>
          <Button
            icon={<Plus className="w-4 h-4" />}
            type="primary"
            size="middle"
            onClick={() => {
              addSupplementItem();
              message.info('已新增空白补正项，请填写内容');
            }}
            className="!rounded-lg !h-9"
            style={{ backgroundColor: '#1E40AF' }}
          >
            新增补正项
          </Button>
          <Button onClick={generateNoticeFromList} className="!rounded-lg !h-9">
            生成通知内容
          </Button>
          <Popconfirm
            title="确认清空所有补正项？"
            okText="清空"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              clearSupplementList();
              message.success('已清空补正清单');
            }}
          >
            <Button danger size="middle" className="!rounded-lg !h-9">
              清空
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <Table
          dataSource={supplementList}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={false}
          locale={{ emptyText: '暂无补正项，请从上方话术库插入或手动新增' }}
          className="[&_.ant-table]:!text-sm [&_thead_.ant-table-cell]:!bg-slate-50 [&_thead_.ant-table-cell]:!text-slate-600 [&_thead_.ant-table-cell]:!font-semibold [&_thead_.ant-table-cell]:!border-b-2 [&_thead_.ant-table-cell]:!border-slate-100 [&_tbody_.ant-table-cell]:!border-b [&_tbody_.ant-table-cell]:!border-slate-50 [&_.ant-table-row:hover>td]:!bg-blue-50/30"
        />
      </div>
    </div>
  );
}
