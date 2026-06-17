import type { DailyStats, ReturnReasonStat } from '../../types';

// 近7天日办件量统计
export const dailyStatsList: DailyStats[] = [
  {
    date: '2026-06-12',
    totalCases: 156,
    completedCases: 148,
    rejectedCases: 4,
    supplementCases: 4,
    avgHandleTime: 22,
  },
  {
    date: '2026-06-13',
    totalCases: 142,
    completedCases: 136,
    rejectedCases: 3,
    supplementCases: 3,
    avgHandleTime: 24,
  },
  {
    date: '2026-06-14',
    totalCases: 0,
    completedCases: 0,
    rejectedCases: 0,
    supplementCases: 0,
    avgHandleTime: 0,
  },
  {
    date: '2026-06-15',
    totalCases: 0,
    completedCases: 0,
    rejectedCases: 0,
    supplementCases: 0,
    avgHandleTime: 0,
  },
  {
    date: '2026-06-16',
    totalCases: 168,
    completedCases: 158,
    rejectedCases: 5,
    supplementCases: 5,
    avgHandleTime: 21,
  },
  {
    date: '2026-06-17',
    totalCases: 175,
    completedCases: 165,
    rejectedCases: 6,
    supplementCases: 4,
    avgHandleTime: 23,
  },
  {
    date: '2026-06-18',
    totalCases: 98,
    completedCases: 62,
    rejectedCases: 2,
    supplementCases: 3,
    avgHandleTime: 25,
  },
];

// 退件原因统计
export const returnReasonStats: ReturnReasonStat[] = [
  {
    reason: '必备材料缺失',
    count: 23,
    percentage: 28.8,
    category: '材料',
  },
  {
    reason: '材料不清晰或不完整',
    count: 18,
    percentage: 22.5,
    category: '材料',
  },
  {
    reason: '材料信息不一致',
    count: 12,
    percentage: 15.0,
    category: '材料',
  },
  {
    reason: '身份信息核验不通过',
    count: 9,
    percentage: 11.3,
    category: '信息',
  },
  {
    reason: '不符合办理资格条件',
    count: 8,
    percentage: 10.0,
    category: '资格',
  },
  {
    reason: '居住登记未满半年',
    count: 5,
    percentage: 6.3,
    category: '资格',
  },
  {
    reason: '信息录入错误',
    count: 3,
    percentage: 3.8,
    category: '信息',
  },
  {
    reason: '系统接口异常',
    count: 2,
    percentage: 2.5,
    category: '系统',
  },
];

// 场景办件量排行
export interface SceneRankItem {
  rank: number;
  sceneId: string;
  sceneName: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'flat';
  trendValue: number;
}

export const sceneRankList: SceneRankItem[] = [
  {
    rank: 1,
    sceneId: 'scene-newborn-allinone',
    sceneName: '新生儿出生一件事（全流程联办）',
    count: 142,
    percentage: 22.8,
    trend: 'up',
    trendValue: 12.5,
  },
  {
    rank: 2,
    sceneId: 'scene-newborn-register',
    sceneName: '新生儿上户口',
    count: 108,
    percentage: 17.3,
    trend: 'up',
    trendValue: 8.2,
  },
  {
    rank: 3,
    sceneId: 'scene-idcard-replace',
    sceneName: '居民身份证换领',
    count: 95,
    percentage: 15.3,
    trend: 'flat',
    trendValue: 0.5,
  },
  {
    rank: 4,
    sceneId: 'scene-residence-permit',
    sceneName: '居住证办理',
    count: 86,
    percentage: 13.8,
    trend: 'up',
    trendValue: 15.6,
  },
  {
    rank: 5,
    sceneId: 'scene-newborn-insurance',
    sceneName: '新生儿医保社保联办',
    count: 72,
    percentage: 11.6,
    trend: 'up',
    trendValue: 6.8,
  },
  {
    rank: 6,
    sceneId: 'scene-move-in',
    sceneName: '夫妻投靠落户',
    count: 52,
    percentage: 8.4,
    trend: 'down',
    trendValue: -3.2,
  },
  {
    rank: 7,
    sceneId: 'scene-social-security-transfer',
    sceneName: '社保转移',
    count: 38,
    percentage: 6.1,
    trend: 'flat',
    trendValue: 1.2,
  },
  {
    rank: 8,
    sceneId: 'scene-idcard-makeup',
    sceneName: '身份证补领',
    count: 28,
    percentage: 4.5,
    trend: 'up',
    trendValue: 4.8,
  },
];

// 总体概览数据
export interface OverviewStats {
  todayTotal: number; // 今日总办件
  todayCompleted: number; // 今日已完成
  todayPending: number; // 今日待办
  todayRejectRate: number; // 今日退件率
  weekTotal: number; // 本周总办件
  monthTotal: number; // 本月总办件
  avgHandleTime: number; // 平均办理时长（分钟）
  oneTimePassRate: number; // 一次通过率
  jointCaseRate: number; // 联办事项占比
}

export const overviewStats: OverviewStats = {
  todayTotal: 98,
  todayCompleted: 62,
  todayPending: 36,
  todayRejectRate: 2.0,
  weekTotal: 739,
  monthTotal: 2856,
  avgHandleTime: 22.5,
  oneTimePassRate: 92.3,
  jointCaseRate: 45.8,
};

// 办理时段分布（按小时）
export interface HourlyDistribution {
  hour: number;
  label: string;
  count: number;
}

export const hourlyDistribution: HourlyDistribution[] = [
  { hour: 8, label: '08:00', count: 5 },
  { hour: 9, label: '09:00', count: 22 },
  { hour: 10, label: '10:00', count: 28 },
  { hour: 11, label: '11:00', count: 18 },
  { hour: 12, label: '12:00', count: 6 },
  { hour: 13, label: '13:00', count: 4 },
  { hour: 14, label: '14:00', count: 20 },
  { hour: 15, label: '15:00', count: 26 },
  { hour: 16, label: '16:00', count: 22 },
  { hour: 17, label: '17:00', count: 12 },
];

// 部门办理量统计
export interface DepartmentStat {
  deptName: string;
  totalCases: number;
  completedCases: number;
  processingCases: number;
  avgTime: number;
}

export const departmentStats: DepartmentStat[] = [
  {
    deptName: '卫生健康委',
    totalCases: 312,
    completedCases: 298,
    processingCases: 14,
    avgTime: 18,
  },
  {
    deptName: '公安局',
    totalCases: 586,
    completedCases: 562,
    processingCases: 24,
    avgTime: 25,
  },
  {
    deptName: '医疗保障局',
    totalCases: 210,
    completedCases: 201,
    processingCases: 9,
    avgTime: 22,
  },
  {
    deptName: '人力资源社会保障局',
    totalCases: 192,
    completedCases: 184,
    processingCases: 8,
    avgTime: 28,
  },
];

// 按分类获取退件原因
export const getReturnReasonsByCategory = (category: ReturnReasonStat['category'] | 'all'): ReturnReasonStat[] => {
  if (category === 'all') return returnReasonStats;
  return returnReasonStats.filter((r) => r.category === category);
};

// 计算累计办件量
export const getCumulativeCases = (): { date: string; count: number }[] => {
  let cumulative = 0;
  return dailyStatsList.map((d) => {
    cumulative += d.totalCases;
    return { date: d.date, count: cumulative };
  });
};

export default {
  dailyStatsList,
  returnReasonStats,
  sceneRankList,
  overviewStats,
  hourlyDistribution,
  departmentStats,
};
