import { useSupplementStore } from '@/store/supplementStore';
import type { SupplementScript } from '@/data/libraries/supplementScripts';
import { Collapse, Input, Tag, Button, Tooltip, Empty } from 'antd';
import {
  Search,
  BookOpen,
  FileText,
  IdCard,
  MessageSquarePlus,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SupplementScript as ScriptType } from '@/data/libraries/supplementScripts';

const { Search: SearchInput } = Input;

const categoryIcon: Record<string, React.ReactNode> = {
  证件类: <IdCard className="w-4 h-4" />,
  材料类: <FileText className="w-4 h-4" />,
  信息类: <BookOpen className="w-4 h-4" />,
};

const categoryColor: Record<string, { tag: string; bg: string; border: string; text: string }> = {
  证件类: {
    tag: 'geekblue',
    bg: 'from-geekblue-50 to-blue-50',
    border: 'border-geekblue-200',
    text: 'text-geekblue-700',
  },
  材料类: {
    tag: 'purple',
    bg: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
  信息类: {
    tag: 'cyan',
    bg: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
  },
};

interface ScriptCardProps {
  script: ScriptType;
  onInsert: (id: string) => void;
}

function ScriptCard({ script, onInsert }: ScriptCardProps) {
  const cfg = categoryColor[script.category];
  const placeholders = script.content.match(/\{[^}]+\}/g) || [];
  const hasPlaceholders = placeholders.length > 0;

  return (
    <div
      className={cn(
        'rounded-xl border-2 bg-gradient-to-br p-4 transition-all duration-300 hover:shadow-md',
        cfg.bg,
        cfg.border
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h4 className="font-semibold text-sm text-slate-800">{script.title}</h4>
            {script.urgency === 'urgent' && (
              <Tooltip title="紧急补正">
                <span className="flex items-center gap-0.5 text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  紧急
                </span>
              </Tooltip>
            )}
            {script.subCategory && (
              <Tag color={cfg.tag} className="!m-0 !rounded !text-[10px] !px-1.5 !py-0">
                {script.subCategory}
              </Tag>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span>{script.code}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              默认 {script.defaultDeadlineDays} 天
            </span>
          </div>
        </div>
        <Tooltip title="一键插入补正清单">
          <Button
            type="primary"
            size="small"
            icon={<MessageSquarePlus className="w-3.5 h-3.5" />}
            onClick={() => onInsert(script.id)}
            className="!rounded-lg !h-8 !px-3 !font-medium"
            style={{ backgroundColor: '#1E40AF' }}
          >
            插入
          </Button>
        </Tooltip>
      </div>

      <div className="text-xs text-slate-600 leading-relaxed bg-white/70 rounded-lg p-3 border border-white/50">
        {hasPlaceholders && (
          <div className="flex flex-wrap gap-1 mb-2">
            {Array.from(new Set(placeholders)).map((p, idx) => (
              <span
                key={idx}
                className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 font-mono"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <p className="whitespace-pre-wrap line-clamp-3">
          {script.content.split(/(\{[^}]+\})/g).map((part, i) =>
            part.startsWith('{') && part.endsWith('}') ? (
              <span key={i} className="text-amber-600 font-semibold">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>
      </div>
    </div>
  );
}

export default function ScriptLibrary() {
  const {
    scriptList,
    activeScriptCategory,
    searchKeyword,
    expandedPanels,
    setActiveScriptCategory,
    setSearchKeyword,
    togglePanel,
    expandAllPanels,
    collapseAllPanels,
    insertScriptToSupplement,
    getFilteredScripts,
  } = useSupplementStore();

  const filteredScripts = getFilteredScripts();

  const groupedScripts = scriptList.reduce<Record<string, ScriptType[]>>((acc, s) => {
    if (!s.enabled) return acc;
    if (activeScriptCategory !== 'all' && s.category !== activeScriptCategory) return acc;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      const match =
        s.title.toLowerCase().includes(kw) ||
        s.content.toLowerCase().includes(kw) ||
        s.code.toLowerCase().includes(kw) ||
        (s.subCategory?.toLowerCase() ?? '').includes(kw);
      if (!match) return acc;
    }
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryCounts = Object.keys(groupedScripts).reduce<Record<string, number>>((acc, k) => {
    acc[k] = groupedScripts[k].length;
    return acc;
  }, {});

  const totalCount = filteredScripts.length;

  const collapseItems = Object.entries(groupedScripts).map(([category, scripts]) => {
    const cfg = categoryColor[category] || categoryColor['证件类'];
    return {
      key: category,
      label: (
        <div className="flex items-center gap-3 py-0.5">
          <span className={cfg.text}>{categoryIcon[category]}</span>
          <span className="font-semibold text-sm text-slate-700">{category}话术</span>
          <Tag color={cfg.tag} className="!m-0 !rounded-full !text-xs !px-2.5">
            {categoryCounts[category]} 条
          </Tag>
        </div>
      ),
      children: (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pt-1">
          {scripts.map((s) => (
            <ScriptCard key={s.id} script={s} onInsert={insertScriptToSupplement} />
          ))}
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-lg font-semibold text-slate-800">补正话术库</h2>
          <Tag color="blue" className="!rounded-full !m-0 !text-xs font-medium">
            共 {totalCount} 条
          </Tag>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {[
              { key: 'all', label: '全部' },
              { key: '证件类', label: '证件类' },
              { key: '材料类', label: '材料类' },
              { key: '信息类', label: '信息类' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveScriptCategory(item.key as SupplementScript['category'] | 'all')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  activeScriptCategory === item.key
                    ? 'bg-white text-[#1E40AF] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <SearchInput
            allowClear
            placeholder="搜索话术标题/内容/编码..."
            prefix={<Search className="w-4 h-4 text-slate-400" />}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="!w-72"
          />

          <Button
            size="small"
            icon={expandedPanels.length === 3 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            onClick={() => (expandedPanels.length === 3 ? collapseAllPanels() : expandAllPanels())}
            className="!rounded-lg"
          >
            {expandedPanels.length === 3 ? '全部折叠' : '全部展开'}
          </Button>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 py-16">
          <Empty description="未找到匹配的补正话术" />
        </div>
      ) : (
        <Collapse
          activeKey={expandedPanels}
          onChange={(keys) => {
            const keyArr = Array.isArray(keys) ? keys : [keys];
            if (keyArr.length > expandedPanels.length) {
              const newKey = keyArr.find((k) => !expandedPanels.includes(k));
              if (newKey) togglePanel(newKey as string);
            } else {
              const removedKey = expandedPanels.find((k) => !keyArr.includes(k));
              if (removedKey) togglePanel(removedKey);
            }
          }}
          size="large"
          className="!bg-transparent !border-0 [&_.ant-collapse-item]:!rounded-xl [&_.ant-collapse-item]:!bg-white [&_.ant-collapse-item]:!border [&_.ant-collapse-item]:!border-slate-100 [&_.ant-collapse-item]:!mb-3 [&_.ant-collapse-item]:!overflow-hidden [&_.ant-collapse-header]:!px-5 [&_.ant-collapse-header]:!py-4 [&_.ant-collapse-content-box]:!px-5 [&_.ant-collapse-content-box]:!pb-5"
          items={collapseItems}
        />
      )}
    </div>
  );
}
