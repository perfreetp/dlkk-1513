import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import DailyStats from '@/components/charts/DailyStats';
import { overviewStats } from '@/data/mock/statsData';
import {
  PhoneCall,
  IdCard,
  Link2,
  FileEdit,
  AlertOctagon,
  Archive,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ModuleCard {
  key: string;
  name: string;
  route: string;
  icon: typeof PhoneCall;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
  todayCount: number;
}

const moduleCards: ModuleCard[] = [
  {
    key: 'call-receive',
    name: '叫号受理',
    route: '/call-receive',
    icon: PhoneCall,
    color: '#1677ff',
    bgColor: 'bg-blue-50',
    borderColor: 'hover:border-blue-300',
    desc: '叫号管理、信息录入、建单受理',
    todayCount: 98,
  },
  {
    key: 'info-verify',
    name: '信息核验',
    route: '/info-verify',
    icon: IdCard,
    color: '#13c2c2',
    bgColor: 'bg-cyan-50',
    borderColor: 'hover:border-cyan-300',
    desc: '身份核验、材料校验、信息比对',
    todayCount: 86,
  },
  {
    key: 'combo-arrange',
    name: '联办编排',
    route: '/combo-arrange',
    icon: Link2,
    color: '#722ed1',
    bgColor: 'bg-violet-50',
    borderColor: 'hover:border-violet-300',
    desc: '事项编排、部门流转、进度跟踪',
    todayCount: 72,
  },
  {
    key: 'supplement',
    name: '材料补正',
    route: '/supplement',
    icon: FileEdit,
    color: '#fa8c16',
    bgColor: 'bg-amber-50',
    borderColor: 'hover:border-amber-300',
    desc: '补正通知、材料补充、补正审核',
    todayCount: 12,
  },
  {
    key: 'exception-return',
    name: '异常退件',
    route: '/exception-return',
    icon: AlertOctagon,
    color: '#ef4444',
    bgColor: 'bg-rose-50',
    borderColor: 'hover:border-rose-300',
    desc: '异常处理、退件登记、申诉复核',
    todayCount: 5,
  },
  {
    key: 'archive',
    name: '办结归档',
    route: '/archive',
    icon: Archive,
    color: '#52c41a',
    bgColor: 'bg-emerald-50',
    borderColor: 'hover:border-emerald-300',
    desc: '办结确认、材料归档、证照关联',
    todayCount: 62,
  },
];

const quickStats = [
  {
    title: '今日办件',
    value: overviewStats.todayTotal,
    suffix: '件',
    icon: FileText,
    color: '#1677ff',
    bg: 'bg-blue-50',
  },
  {
    title: '已办结',
    value: overviewStats.todayCompleted,
    suffix: '件',
    icon: CheckCircle2,
    color: '#52c41a',
    bg: 'bg-emerald-50',
  },
  {
    title: '待处理',
    value: overviewStats.todayPending,
    suffix: '件',
    icon: AlertTriangle,
    color: '#fa8c16',
    bg: 'bg-amber-50',
  },
  {
    title: '平均时长',
    value: overviewStats.avgHandleTime,
    suffix: '分钟',
    icon: Clock,
    color: '#722ed1',
    bg: 'bg-violet-50',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleModuleClick = (route: string) => {
    navigate(route);
  };

  return (
    <PageLayout
      title="工作台首页"
      subtitle="出生一件事联办工作台 - 政务服务中心"
      activeNav="home"
      breadcrumb={[{ title: '首页' }]}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="gov-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
                    <span className="text-sm text-slate-500">{stat.suffix}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              <PhoneCall className="w-5 h-5 text-blue-600" />
              业务模块入口
            </div>
            <span className="text-xs text-slate-400">点击进入对应模块</span>
          </div>
          <div className="gov-card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleCards.map((module) => (
                <div
                  key={module.key}
                  onClick={() => handleModuleClick(module.route)}
                  className={`group relative p-5 rounded-xl border border-slate-200 ${module.borderColor} bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${module.bgColor}`}
                    >
                      <module.icon className="w-7 h-7" style={{ color: module.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-slate-800 group-hover:text-slate-900">
                          {module.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{module.desc}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ backgroundColor: `${module.color}15`, color: module.color }}
                        >
                          今日 {module.todayCount} 件
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ backgroundColor: module.color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <FileText className="w-5 h-5 text-indigo-600" />
                近7日办件趋势
              </div>
              <span className="text-xs text-slate-400">本周累计 {overviewStats.weekTotal} 件</span>
            </div>
            <div className="gov-card-body pt-2">
              <DailyStats />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                效率指标概览
              </div>
              <span className="text-xs text-slate-400">本月数据</span>
            </div>
            <div className="gov-card-body">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">一次通过率</span>
                    <span className="text-sm font-semibold text-emerald-600">{overviewStats.oneTimePassRate}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${overviewStats.oneTimePassRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">联办事项占比</span>
                    <span className="text-sm font-semibold text-violet-600">{overviewStats.jointCaseRate}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${overviewStats.jointCaseRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">今日办结率</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {((overviewStats.todayCompleted / overviewStats.todayTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${(overviewStats.todayCompleted / overviewStats.todayTotal) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">本周办件</p>
                    <p className="text-2xl font-bold text-slate-800">{overviewStats.weekTotal}<span className="text-xs font-normal text-slate-500 ml-1">件</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <p className="text-xs text-slate-500 mb-1">本月办件</p>
                    <p className="text-2xl font-bold text-slate-800">{overviewStats.monthTotal}<span className="text-xs font-normal text-slate-500 ml-1">件</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
