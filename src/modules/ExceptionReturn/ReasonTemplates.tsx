import { Card, Input, Tag, Empty, Divider } from 'antd';
import {
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle2,
  MessageSquarePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useExceptionReturnStore,
  type ReasonTemplate,
} from '@/store/exceptionReturnStore';

const { TextArea } = Input;

const categoryColorMap: Record<string, string> = {
  material: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  qualification: 'bg-purple-100 text-purple-700 border-purple-200',
  system: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  business: 'bg-orange-100 text-orange-700 border-orange-200',
  other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const categoryLabelMap: Record<string, string> = {
  material: '材料',
  info: '信息',
  qualification: '资格',
  system: '系统',
  business: '业务',
  other: '其他',
};

export default function ReasonTemplates() {
  const {
    reasonTemplates,
    selectedExceptionType,
    selectedTemplateId,
    setSelectedTemplateId,
    customRemark,
    setCustomRemark,
  } = useExceptionReturnStore();

  const filteredTemplates = selectedExceptionType
    ? reasonTemplates.filter((t) => t.category === selectedExceptionType)
    : reasonTemplates;

  const sortedTemplates = [...filteredTemplates].sort(
    (a, b) => b.useCount - a.useCount,
  );

  const selectedTemplate = reasonTemplates.find(
    (t) => t.id === selectedTemplateId,
  );

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(selectedTemplateId === id ? null : id);
  };

  const getHeatColor = (count: number, max: number) => {
    const ratio = count / max;
    if (ratio > 0.7) return 'bg-gradient-to-r from-rose-500 to-red-500';
    if (ratio > 0.4) return 'bg-gradient-to-r from-orange-500 to-amber-500';
    if (ratio > 0.15) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-slate-400 to-slate-500';
  };

  const maxCount = Math.max(...reasonTemplates.map((t) => t.useCount), 1);

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <ClipboardList size={18} className="text-primary-600" />
            退回原因模板
          </span>
          {selectedExceptionType && (
            <Tag
              color="blue"
              closable
              onClose={() => useExceptionReturnStore.getState().setSelectedExceptionType(null)}
              className="m-0"
            >
              已筛选：{categoryLabelMap[selectedExceptionType]}
            </Tag>
          )}
        </div>
      }
      className="h-full"
    >
      <div className="space-y-3">
        {sortedTemplates.length === 0 ? (
          <Empty description="暂无匹配的模板" className="py-8" />
        ) : (
          sortedTemplates.map((template: ReasonTemplate, index) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={cn(
                  'group relative cursor-pointer rounded-xl border p-4 transition-all duration-200',
                  isSelected
                    ? 'border-primary-500 bg-primary-50/60 shadow-md ring-2 ring-primary-100'
                    : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-sm',
                )}
              >
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm">
                    <CheckCircle2 size={16} />
                  </div>
                )}

                <div className="mb-2.5 flex items-start justify-between gap-4 pr-10">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm',
                        index < 3
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : 'bg-slate-300',
                      )}
                    >
                      {index + 1}
                    </span>
                    <h4
                      className={cn(
                        'text-sm font-semibold',
                        isSelected ? 'text-primary-700' : 'text-slate-800',
                      )}
                    >
                      {template.title}
                    </h4>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium',
                      categoryColorMap[template.category],
                    )}
                  >
                    {categoryLabelMap[template.category]}
                  </span>
                </div>

                <p className="mb-3 pl-8 text-sm leading-relaxed text-slate-600">
                  {template.content}
                </p>

                <div className="mb-3 pl-8">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          getHeatColor(template.useCount, maxCount),
                        )}
                        style={{
                          width: `${(template.useCount / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                      <TrendingUp size={12} className="text-orange-500" />
                      {template.useCount} 次
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2.5 pl-8">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    最近使用：{template.lastUsedAt}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Divider className="my-4" />

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <MessageSquarePlus size={16} className="text-primary-600" />
          补充说明（选填）
        </div>
        <TextArea
          value={customRemark}
          onChange={(e) => setCustomRemark(e.target.value)}
          placeholder="可在此输入自定义的补充说明，将与模板内容合并作为最终退回原因..."
          rows={3}
          className="resize-none"
          count={{ show: true, max: 500 }}
        />
        {selectedTemplate && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1.5 text-xs font-medium text-slate-500">
              已选模板预览：
            </div>
            <div className="text-sm text-slate-700">
              {selectedTemplate.content}
              {customRemark && (
                <>
                  <div className="my-1.5 border-t border-dashed border-slate-300" />
                  <span className="text-primary-700">【补充】{customRemark}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
