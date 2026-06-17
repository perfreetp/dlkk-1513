import { useComboArrangeStore, type DepartmentType, type ComboItem } from '@/store/comboArrangeStore';
import { Checkbox, Tag, Card, Button, Tooltip } from 'antd';
import {
  Building2,
  Clock,
  FileText,
  Check,
  AlertCircle,
  Shield,
  Users,
  Stethoscope,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const deptConfig: Record<DepartmentType, { icon: React.ReactNode; color: string; bg: string; tagColor: string }> = {
  公安: {
    icon: <Shield className="w-5 h-5" />,
    color: 'text-geekblue-700',
    bg: 'from-geekblue-50 to-blue-50',
    tagColor: 'geekblue',
  },
  人社: {
    icon: <Users className="w-5 h-5" />,
    color: 'text-purple-700',
    bg: 'from-purple-50 to-violet-50',
    tagColor: 'purple',
  },
  医保: {
    icon: <Stethoscope className="w-5 h-5" />,
    color: 'text-cyan-700',
    bg: 'from-cyan-50 to-sky-50',
    tagColor: 'cyan',
  },
  卫健: {
    icon: <Scale className="w-5 h-5" />,
    color: 'text-green-700',
    bg: 'from-green-50 to-emerald-50',
    tagColor: 'green',
  },
};

interface ItemCardProps {
  item: ComboItem;
  selected: boolean;
  onToggle: (id: string) => void;
}

function ItemCard({ item, selected, onToggle }: ItemCardProps) {
  const cfg = deptConfig[item.department];
  const disabled = item.required && selected;

  return (
    <Card
      hoverable={!disabled}
      onClick={() => !disabled && onToggle(item.id)}
      className={cn(
        'relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border-2',
        `bg-gradient-to-br ${cfg.bg}`,
        selected
          ? '!border-[#1E40AF] ring-4 ring-blue-100 shadow-xl'
          : '!border-slate-100 hover:shadow-lg hover:!border-slate-200',
        disabled && 'cursor-not-allowed opacity-100'
      )}
      bodyStyle={{ padding: 0 }}
    >
      <div
        className={cn(
          'absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
          selected
            ? 'bg-[#1E40AF] text-white shadow-md'
            : 'bg-white/70 text-slate-300 border-2 border-slate-200'
        )}
      >
        {selected ? <Check className="w-4 h-4" /> : null}
      </div>

      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
              selected
                ? 'bg-white shadow-md'
                : 'bg-white/80'
            )}
          >
            <span className={cfg.color}>{cfg.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-semibold text-base leading-tight',
                selected ? 'text-[#1E40AF]' : 'text-slate-800'
              )}
            >
              {item.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Tag color={cfg.tagColor} className="!m-0 !rounded !px-2 !text-[11px] font-medium">
                {item.department}
              </Tag>
              {item.required && (
                <Tooltip title="必选事项，不可取消">
                  <span className="flex items-center gap-0.5 text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                    <AlertCircle className="w-3 h-3" />
                    必选
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 min-h-[32px]">
          {item.description}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-2">
            <Clock className={cn('w-4 h-4 shrink-0', selected ? 'text-[#1E40AF]' : 'text-slate-400')} />
            <div>
              <div className="text-[10px] text-slate-400 leading-none mb-1">办理时限</div>
              <div className={cn('text-xs font-semibold', selected ? 'text-slate-800' : 'text-slate-600')}>
                {item.timeLimit}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className={cn('w-4 h-4 shrink-0', selected ? 'text-[#1E40AF]' : 'text-slate-400')} />
            <div>
              <div className="text-[10px] text-slate-400 leading-none mb-1">所需材料</div>
              <div className={cn('text-xs font-semibold', selected ? 'text-slate-800' : 'text-slate-600')}>
                <span className={cn('text-base font-bold mr-0.5', selected ? 'text-[#1E40AF]' : 'text-slate-700')}>
                  {item.materialCount}
                </span>
                份
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="bg-[#1E40AF] px-5 py-2 text-xs text-white text-center font-medium flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          已加入联办事项
        </div>
      )}
    </Card>
  );
}

export default function ItemMatrix() {
  const { itemList, selectedItemIds, toggleItem, selectAllItems, clearAllItems } =
    useComboArrangeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-lg font-semibold text-slate-800">联办事项组合矩阵</h2>
          <Tag color="blue" className="!rounded-full !px-3 !text-xs font-medium !m-0 ml-2">
            已选 {selectedItemIds.length}/{itemList.length} 项
          </Tag>
        </div>
        <div className="flex items-center gap-2">
          <Button size="small" onClick={clearAllItems} className="!rounded-lg">
            重置
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={selectAllItems}
            className="!bg-[#1E40AF] !rounded-lg"
          >
            全选联办
          </Button>
        </div>
      </div>

      <Checkbox.Group
        value={selectedItemIds}
        className="w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {itemList.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={selectedItemIds.includes(item.id)}
              onToggle={toggleItem}
            />
          ))}
        </div>
      </Checkbox.Group>
    </div>
  );
}
