// 模块配置接口
export interface ModuleConfig {
  id: string; // 模块ID
  name: string; // 模块名称
  code: string; // 模块编码
  route: string; // 路由路径
  icon: string; // 图标名称
  color: string; // 主题色
  bgColor: string; // 背景色
  desc: string; // 模块描述
  order: number; // 排序
  enabled: boolean; // 是否启用
}

// 6大模块配置
export const moduleConfigList: ModuleConfig[] = [
  {
    id: 'module-queue',
    name: '叫号引导',
    code: 'QUEUE',
    route: '/queue',
    icon: 'QueueList',
    color: '#1677ff',
    bgColor: '#e6f4ff',
    desc: '智能取号、叫号管理与引导分流',
    order: 1,
    enabled: true,
  },
  {
    id: 'module-accept',
    name: '窗口受理',
    code: 'ACCEPT',
    route: '/accept',
    icon: 'FormOutlined',
    color: '#52c41a',
    bgColor: '#f6ffed',
    desc: '信息录入、材料核验、业务受理',
    order: 2,
    enabled: true,
  },
  {
    id: 'module-scan',
    name: '材料归档',
    code: 'SCAN',
    route: '/scan',
    icon: 'FileScan',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    desc: '材料扫描、电子归档、证照关联',
    order: 3,
    enabled: true,
  },
  {
    id: 'module-review',
    name: '审核审批',
    code: 'REVIEW',
    route: '/review',
    icon: 'Audit',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    desc: '多级审核、交叉复核、结果推送',
    order: 4,
    enabled: true,
  },
  {
    id: 'module-print',
    name: '证件打制',
    code: 'PRINT',
    route: '/print',
    icon: 'Printer',
    color: '#eb2f96',
    bgColor: '#fff0f6',
    desc: '证照打印、质量检测、发证签收',
    order: 5,
    enabled: true,
  },
  {
    id: 'module-stats',
    name: '统计分析',
    code: 'STATS',
    route: '/stats',
    icon: 'LineChart',
    color: '#13c2c2',
    bgColor: '#e6fffb',
    desc: '办件统计、效率分析、趋势预警',
    order: 6,
    enabled: true,
  },
];

// 根据ID获取模块配置
export const getModuleById = (id: string): ModuleConfig | undefined => {
  return moduleConfigList.find((m) => m.id === id);
};

// 根据路由获取模块配置
export const getModuleByRoute = (route: string): ModuleConfig | undefined => {
  return moduleConfigList.find((m) => m.route === route);
};

// 获取已启用模块
export const getEnabledModules = (): ModuleConfig[] => {
  return moduleConfigList.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
};

export default moduleConfigList;
