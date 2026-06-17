import type { ComboItem } from '../../types';

// 办理场景配置接口
export interface SceneConfig {
  id: string; // 场景ID
  name: string; // 场景名称
  code: string; // 场景编码
  shortName: string; // 简称
  category: '出生登记' | '户口迁移' | '证件办理' | '社保医保' | '其他'; // 场景分类
  queueType: 'A' | 'B' | 'C'; // 队列类型
  description: string; // 场景描述
  estTime: number; // 预计办理时长（分钟）
  materials: string[]; // 所需材料ID列表
  departments: string[]; // 联办部门
  tags: string[]; // 标签
  enabled: boolean; // 是否启用
  isHot?: boolean; // 是否热门
  isJoint?: boolean; // 是否联办
  order: number; // 排序
}

// 常见情形配置
export const sceneConfigList: SceneConfig[] = [
  {
    id: 'scene-newborn-register',
    name: '新生儿出生登记（出生医学证明+户口登记）',
    code: 'NB_REG',
    shortName: '新生儿上户口',
    category: '出生登记',
    queueType: 'A',
    description: '新生儿出生后30天内办理出生登记，含出生医学证明签发和常住户口登记',
    estTime: 25,
    materials: ['mat-birth-cert', 'mat-parent-id', 'mat-marriage-cert', 'mat-household'],
    departments: ['卫生健康委', '公安局'],
    tags: ['出生一件事', '联办事项', '高频事项'],
    enabled: true,
    isHot: true,
    isJoint: true,
    order: 1,
  },
  {
    id: 'scene-newborn-insurance',
    name: '新生儿医保社保联办',
    code: 'NB_INS',
    shortName: '医保社保联办',
    category: '社保医保',
    queueType: 'A',
    description: '新生儿城乡居民基本医疗保险参保登记、社会保障卡申领联办',
    estTime: 30,
    materials: ['mat-birth-cert', 'mat-household', 'mat-parent-id', 'mat-bank-card'],
    departments: ['医疗保障局', '人力资源社会保障局'],
    tags: ['出生一件事', '联办事项'],
    enabled: true,
    isJoint: true,
    order: 2,
  },
  {
    id: 'scene-newborn-vaccine',
    name: '预防接种证办理',
    code: 'NB_VAC',
    shortName: '预防接种证',
    category: '出生登记',
    queueType: 'B',
    description: '新生儿预防接种证发放与接种档案建立',
    estTime: 15,
    materials: ['mat-birth-cert', 'mat-parent-id', 'mat-hospital-discharge'],
    departments: ['卫生健康委'],
    tags: ['出生一件事'],
    enabled: true,
    order: 3,
  },
  {
    id: 'scene-move-in',
    name: '夫妻投靠户口迁入',
    code: 'MV_MARRY',
    shortName: '夫妻投靠落户',
    category: '户口迁移',
    queueType: 'B',
    description: '因结婚申请将配偶户口迁入本市',
    estTime: 20,
    materials: ['mat-applicant-id', 'mat-household', 'mat-marriage-cert', 'mat-house-proof'],
    departments: ['公安局'],
    tags: ['户口迁移', '高频事项'],
    enabled: true,
    isHot: true,
    order: 4,
  },
  {
    id: 'scene-idcard-replace',
    name: '居民身份证换领',
    code: 'ID_REPLACE',
    shortName: '身份证换领',
    category: '证件办理',
    queueType: 'C',
    description: '居民身份证有效期满、登记项目变更等换领',
    estTime: 15,
    materials: ['mat-old-idcard', 'mat-household', 'mat-photo-receipt'],
    departments: ['公安局'],
    tags: ['证件办理', '高频事项'],
    enabled: true,
    isHot: true,
    order: 5,
  },
  {
    id: 'scene-idcard-makeup',
    name: '居民身份证补领',
    code: 'ID_MAKEUP',
    shortName: '身份证补领',
    category: '证件办理',
    queueType: 'C',
    description: '居民身份证丢失、损毁后申请补领',
    estTime: 15,
    materials: ['mat-household', 'mat-photo-receipt', 'mat-loss-report'],
    departments: ['公安局'],
    tags: ['证件办理'],
    enabled: true,
    order: 6,
  },
  {
    id: 'scene-residence-permit',
    name: '居住证办理',
    code: 'RES_PERMIT',
    shortName: '居住证办理',
    category: '证件办理',
    queueType: 'C',
    description: '流动人口在本市居住半年以上，有合法稳定就业、住所、连续就读条件之一的',
    estTime: 20,
    materials: ['mat-idcard', 'mat-house-proof', 'mat-employment-proof', 'mat-photo'],
    departments: ['公安局'],
    tags: ['证件办理', '高频事项'],
    enabled: true,
    isHot: true,
    order: 7,
  },
  {
    id: 'scene-social-security-transfer',
    name: '社会保险关系转移接续',
    code: 'SS_TRANSFER',
    shortName: '社保转移',
    category: '社保医保',
    queueType: 'B',
    description: '跨省或跨统筹地区基本养老保险、医疗保险关系转移',
    estTime: 25,
    materials: ['mat-idcard', 'mat-insurance-cert', 'mat-termination-proof', 'mat-transfer-form'],
    departments: ['人力资源社会保障局', '医疗保障局'],
    tags: ['社保医保', '联办事项'],
    enabled: true,
    isJoint: true,
    order: 8,
  },
  {
    id: 'scene-household-split',
    name: '分户立户办理',
    code: 'HH_SPLIT',
    shortName: '分户立户',
    category: '户口迁移',
    queueType: 'B',
    description: '因婚姻关系变更、房屋产权分割等原因申请分户',
    estTime: 20,
    materials: ['mat-idcard', 'mat-household', 'mat-marriage-cert', 'mat-house-proof', 'mat-split-agreement'],
    departments: ['公安局'],
    tags: ['户口迁移'],
    enabled: true,
    order: 9,
  },
  {
    id: 'scene-newborn-allinone',
    name: '新生儿出生一件事（全流程联办）',
    code: 'NB_ALL',
    shortName: '出生一件事全办',
    category: '出生登记',
    queueType: 'A',
    description: '出生医学证明、户口登记、医保参保、社保卡申领、预防接种证一站式联办',
    estTime: 45,
    materials: [
      'mat-birth-cert',
      'mat-parent-id',
      'mat-marriage-cert',
      'mat-household',
      'mat-bank-card',
      'mat-hospital-discharge',
    ],
    departments: ['卫生健康委', '公安局', '医疗保障局', '人力资源社会保障局'],
    tags: ['出生一件事', '联办事项', '一件事集成', '热门推荐'],
    enabled: true,
    isHot: true,
    isJoint: true,
    order: 10,
  },
];

// 场景分类
export const sceneCategoryList: ComboItem[] = [
  { label: '全部', value: 'all' },
  { label: '出生登记', value: '出生登记' },
  { label: '户口迁移', value: '户口迁移' },
  { label: '证件办理', value: '证件办理' },
  { label: '社保医保', value: '社保医保' },
  { label: '其他', value: '其他' },
];

// 根据ID获取场景配置
export const getSceneById = (id: string): SceneConfig | undefined => {
  return sceneConfigList.find((s) => s.id === id);
};

// 获取热门场景
export const getHotScenes = (): SceneConfig[] => {
  return sceneConfigList.filter((s) => s.isHot && s.enabled);
};

// 获取联办场景
export const getJointScenes = (): SceneConfig[] => {
  return sceneConfigList.filter((s) => s.isJoint && s.enabled);
};

// 按分类获取场景
export const getScenesByCategory = (category: string): SceneConfig[] => {
  if (category === 'all') return sceneConfigList.filter((s) => s.enabled);
  return sceneConfigList.filter((s) => s.category === category && s.enabled);
};

// 转成下拉选择项
export const sceneToComboItems = (): ComboItem[] => {
  return sceneConfigList
    .filter((s) => s.enabled)
    .map((s) => ({
      label: s.shortName,
      value: s.id,
    }));
};

export default sceneConfigList;
