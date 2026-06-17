import { useComboArrangeStore, type SceneCategory } from '@/store/comboArrangeStore';
import { Tag, Card, Badge } from 'antd';
import {
  Baby,
  ClipboardList,
  Layers,
  FileText,
  CreditCard,
  HeartPulse,
  Syringe,
  Gift,
  ShieldPlus,
  Flame,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryList: SceneCategory[] = [
  '热门情形',
  '全办组合',
  '公安类',
  '人社类',
  '医保类',
  '卫健类',
];

const iconMap: Record<string, React.ReactNode> = {
  Baby: <Baby className="w-6 h-6" />,
  ClipboardList: <ClipboardList className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  CreditCard: <CreditCard className="w-6 h-6" />,
  HeartPulse: <HeartPulse className="w-6 h-6" />,
  Syringe: <Syringe className="w-6 h-6" />,
  Gift: <Gift className="w-6 h-6" />,
  ShieldPlus: <ShieldPlus className="w-6 h-6" />,
};

const categoryTagColor: Record<string, string> = {
  热门情形: 'red',
  全办组合: 'blue',
  公安类: 'geekblue',
  人社类: 'purple',
  医保类: 'cyan',
  卫健类: 'green',
};

const sceneCardAccent: Record<string, string> = {
  公安类: 'from-geekblue-50 to-blue-50 border-geekblue-200',
  人社类: 'from-purple-50 to-violet-50 border-purple-200',
  医保类: 'from-cyan-50 to-sky-50 border-cyan-200',
  卫健类: 'from-green-50 to-emerald-50 border-green-200',
  热门情形: 'from-amber-50 to-orange-50 border-amber-200',
  全办组合: 'from-indigo-50 to-blue-50 border-indigo-200',
};

export default function SceneSelector() {
  const {
    activeCategory,
    selectedSceneId,
    sceneList,
    setActiveCategory,
    selectScene,
  } = useComboArrangeStore();

  const filteredScenes = sceneList.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-semibold text-slate-600 mr-2">分类筛选：</span>
        {categoryList.map((cat) => (
          <Tag.CheckableTag
            key={cat}
            checked={activeCategory === cat}
            onChange={() => setActiveCategory(cat)}
            className={cn(
              '!m-0 !px-4 !py-1.5 !rounded-full !border-0 text-sm font-medium transition-all',
              activeCategory === cat
                ? '!bg-[#1E40AF] !text-white shadow-md shadow-blue-200/50'
                : '!bg-slate-100 !text-slate-600 hover:!bg-slate-200'
            )}
          >
            {cat}
          </Tag.CheckableTag>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScenes.map((scene) => {
          const isSelected = selectedSceneId === scene.id;
          const accent = sceneCardAccent[scene.category] || sceneCardAccent['热门情形'];
          const IconNode = iconMap[scene.icon] || <Sparkles className="w-6 h-6" />;

          return (
            <Card
              key={scene.id}
              hoverable
              onClick={() => selectScene(scene.id)}
              className={cn(
                'cursor-pointer transition-all duration-300 rounded-xl overflow-hidden border-2',
                `bg-gradient-to-br ${accent}`,
                isSelected
                  ? '!border-[#1E40AF] ring-4 ring-blue-100 shadow-xl scale-[1.02]'
                  : '!border-transparent hover:shadow-lg hover:scale-[1.01]'
              )}
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                      isSelected
                        ? 'bg-[#1E40AF] text-white shadow-lg'
                        : 'bg-white/80 text-slate-600 shadow-sm'
                    )}
                  >
                    {IconNode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          'font-semibold text-base truncate',
                          isSelected ? 'text-[#1E40AF]' : 'text-slate-800'
                        )}
                      >
                        {scene.title}
                      </h3>
                      {scene.popular && (
                        <Badge
                          count={<Flame className="w-3 h-3 text-orange-500" />}
                          showZero
                          className="!-top-1"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {scene.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Tag
                        color={categoryTagColor[scene.category]}
                        className="!m-0 !rounded-full !px-2.5 !text-xs"
                      >
                        {scene.category}
                      </Tag>
                      <span className="text-xs font-medium text-slate-500">
                        <span className={cn('text-lg font-bold', isSelected ? 'text-[#1E40AF]' : 'text-slate-700')}>
                          {scene.itemCount}
                        </span>{' '}
                        项联办
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="bg-[#1E40AF] px-5 py-2 text-xs text-white text-center font-medium">
                  ✓ 已选择此方案
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
