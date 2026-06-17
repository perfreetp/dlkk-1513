import PageLayout from '@/components/layout/PageLayout';
import DailyStats from '@/components/charts/DailyStats';
import ReasonPie from '@/components/charts/ReasonPie';
import SankeyFlow from '@/components/charts/SankeyFlow';
import { overviewStats, sceneRankList, departmentStats, returnReasonStats } from '@/data/mock/statsData';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  GitBranch,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

const statCards = [
  {
    title: '今日办件数',
    value: 98,
    suffix: '件',
    icon: FileText,
    color: '#1677ff',
    bgColor: '#e6f4ff',
    trend: '+12.5%',
    trendType: 'up' as const,
  },
  {
    title: '已办结',
    value: 62,
    suffix: '件',
    icon: CheckCircle2,
    color: '#52c41a',
    bgColor: '#f6ffed',
    trend: '+8.2%',
    trendType: 'up' as const,
  },
  {
    title: '补正率',
    value: 3.1,
    suffix: '%',
    icon: AlertTriangle,
    color: '#fa8c16',
    bgColor: '#fff7e6',
    trend: '-0.8%',
    trendType: 'down' as const,
  },
  {
    title: '平均办理时长',
    value: 22.5,
    suffix: '分钟',
    icon: Clock,
    color: '#722ed1',
    bgColor: '#f9f0ff',
    trend: '-2.1%',
    trendType: 'down' as const,
  },
];

function TrendBadge({ trend, type }: { trend: string; type: 'up' | 'down' | 'flat' }) {
  const styles = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    flat: 'text-slate-600 bg-slate-50',
  } as const;
  const icons = {
    up: <TrendingUp className="w-3 h-3" />,
    down: <TrendingDown className="w-3 h-3" />,
    flat: <Minus className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
      {icons[type]}
      {trend}
    </span>
  );
}

const caseTypeOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}件 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { fontSize: 12, color: '#475569' },
    itemWidth: 12,
    itemHeight: 12,
  },
  color: ['#1677ff', '#52c41a', '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96'],
  series: [
    {
      name: '办件类型',
      type: 'pie',
      radius: ['40%', '68%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        scale: true,
        scaleSize: 6,
      },
      data: [
        { value: 142, name: '出生一件事联办' },
        { value: 108, name: '新生儿上户口' },
        { value: 95, name: '身份证换领' },
        { value: 86, name: '居住证办理' },
        { value: 72, name: '医保社保联办' },
        { value: 118, name: '其他事项' },
      ],
    },
  ],
};

const wordCloudOption = {
  tooltip: {
    show: true,
    formatter: (params: any) => `${params.name}: ${params.value}次`,
  },
  series: [
    {
      type: 'graph',
      layout: 'force',
      roam: false,
      draggable: false,
      force: {
        repulsion: 120,
        gravity: 0.1,
        edgeLength: 5,
      },
      label: {
        show: true,
        position: 'inside',
        formatter: (p: any) => p.data.name,
        fontSize: (v: { data: { value: number } }) => {
          const val = v.data.value;
          return Math.max(10, Math.min(22, val / 3));
        },
        fontWeight: 'bold',
        color: (v: { data: { category: number } }) => {
          const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#0ea5e9'];
          return colors[v.data.category % colors.length];
        },
      },
      itemStyle: {
        color: (v: { data: { category: number } }) => {
          const colors = ['#fef2f2', '#fff7ed', '#fefce8', '#f7fee7', '#f0fdf4', '#ecfdf5', '#f0fdfa', '#f0f9ff'];
          return colors[v.data.category % colors.length];
        },
        borderWidth: 1,
        borderColor: (v: { data: { category: number } }) => {
          const colors = ['#fecaca', '#fed7aa', '#fef08a', '#d9f99d', '#bbf7d0', '#a7f3d0', '#99f6e4', '#bae6fd'];
          return colors[v.data.category % colors.length];
        },
      },
      symbolSize: (val: number) => Math.max(35, Math.min(85, val * 2.5)),
      data: returnReasonStats.map((r, i) => ({
        name: r.reason,
        value: r.count,
        category: i,
      })),
      links: [],
    },
  ],
};

const deptRankOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    top: 10,
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLabel: { color: '#64748b', fontSize: 12 },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
  },
  yAxis: {
    type: 'category',
    data: departmentStats.map((d) => d.deptName).reverse(),
    axisLabel: { color: '#475569', fontSize: 12 },
    axisLine: { lineStyle: { color: '#e2e8f0' } },
  },
  series: [
    {
      name: '已完成',
      type: 'bar',
      stack: 'total',
      barWidth: 22,
      itemStyle: { color: '#52c41a', borderRadius: [0, 0, 0, 0] },
      data: departmentStats.map((d) => d.completedCases).reverse(),
    },
    {
      name: '办理中',
      type: 'bar',
      stack: 'total',
      itemStyle: { color: '#fa8c16', borderRadius: [0, 4, 4, 0] },
      label: {
        show: true,
        position: 'right',
        formatter: (p: { dataIndex: number }) => {
          const idx = departmentStats.length - 1 - p.dataIndex;
          return `${departmentStats[idx].totalCases}件`;
        },
        color: '#334155',
        fontSize: 12,
        fontWeight: 500,
      },
      data: departmentStats.map((d) => d.processingCases).reverse(),
    },
  ],
};

export default function Dashboard() {
  return (
    <PageLayout
      title="统计仪表盘"
      subtitle="办件数据统计与分析概览"
      activeNav="dashboard"
      breadcrumb={[{ title: '首页' }, { title: '统计分析' }, { title: '数据仪表盘' }]}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => (
            <div key={idx} className="gov-card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-2">{card.title}</p>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold text-slate-800">{card.value}</span>
                    <span className="text-sm text-slate-500">{card.suffix}</span>
                  </div>
                  <TrendBadge trend={card.trend} type={card.trendType} />
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <card.icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                日办件统计（近7天）
              </div>
              <span className="text-xs text-slate-400">按办事人类型分组</span>
            </div>
            <div className="gov-card-body pt-2">
              <DailyStats />
            </div>
          </div>

          <div className="lg:col-span-2 gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <PieChart className="w-5 h-5 text-rose-500" />
                高频退件原因
              </div>
              <span className="text-xs text-slate-400">本月累计 80 件</span>
            </div>
            <div className="gov-card-body pt-2">
              <ReasonPie />
            </div>
          </div>
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <GitBranch className="w-5 h-5 text-violet-600" />
              办件流向桑基图
            </div>
            <span className="text-xs text-slate-400">各环节流量分布</span>
          </div>
          <div className="gov-card-body pt-2">
            <SankeyFlow />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <PieChart className="w-5 h-5 text-cyan-600" />
                办件类型占比
              </div>
            </div>
            <div className="gov-card-body pt-2">
              <ReactECharts option={caseTypeOption} style={{ height: 300, width: '100%' }} />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                高频退件原因词云
              </div>
            </div>
            <div className="gov-card-body pt-2">
              <ReactECharts option={wordCloudOption} style={{ height: 300, width: '100%' }} />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                各部门办理量排名
              </div>
            </div>
            <div className="gov-card-body pt-2">
              <ReactECharts option={deptRankOption} style={{ height: 300, width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              场景办件量排行
            </div>
          </div>
          <div className="gov-card-body">
            <table className="gov-table">
              <thead>
                <tr>
                  <th className="w-16">排名</th>
                  <th>场景名称</th>
                  <th className="text-right w-28">办件数</th>
                  <th className="text-right w-28">占比</th>
                  <th className="text-right w-28">趋势</th>
                </tr>
              </thead>
              <tbody>
                {sceneRankList.slice(0, 6).map((item) => (
                  <tr key={item.sceneId}>
                    <td>
                      <span
                        className={`inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold ${
                          item.rank === 1
                            ? 'bg-amber-100 text-amber-700'
                            : item.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : item.rank === 3
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-50 text-slate-500'
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td className="font-medium">{item.sceneName}</td>
                    <td className="text-right text-slate-800 font-semibold">{item.count} 件</td>
                    <td className="text-right">{item.percentage}%</td>
                    <td className="text-right">
                      <TrendBadge
                        trend={`${item.trendValue > 0 ? '+' : ''}${item.trendValue}%`}
                        type={item.trend}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
