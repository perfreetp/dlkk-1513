import type { ComboItem } from '../../types';

// 异常类型
export type ExceptionCategory =
  | '材料异常'
  | '信息异常'
  | '资格异常'
  | '系统异常'
  | '业务异常'
  | '其他异常';

// 严重级别
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// 处理方式
export type HandleType =
  | '材料补正'
  | '信息更正'
  | '退回重办'
  | '转特殊通道'
  | '人工干预'
  | '系统修复';

// 异常情形配置接口
export interface ExceptionConfig {
  id: string; // 异常ID
  code: string; // 异常编码
  name: string; // 异常名称
  category: ExceptionCategory; // 异常分类
  description: string; // 异常描述
  severity: SeverityLevel; // 严重级别
  triggerCondition: string; // 触发条件
  handleType: HandleType; // 处理方式
  handleSteps: string[]; // 处理步骤
  relatedScenes: string[]; // 关联场景ID
  autoDetect: boolean; // 是否可自动检测
  notifyApplicant: boolean; // 是否通知申请人
  suggestTimeLimit?: number; // 建议处理时限（小时）
  enabled: boolean; // 是否启用
}

// 异常情形分类配置
export const exceptionConfigList: ExceptionConfig[] = [
  {
    id: 'ex-mat-001',
    code: 'MAT_MISSING',
    name: '必备材料缺失',
    category: '材料异常',
    description: '申请人未提交办件所需的必要材料',
    severity: 'high',
    triggerCondition: '必收材料状态为"未提交"',
    handleType: '材料补正',
    handleSteps: ['列出缺失材料清单', '告知补正期限', '出具补正通知书', '等待申请人补正'],
    relatedScenes: ['scene-newborn-register', 'scene-newborn-allinone', 'scene-idcard-replace'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 72,
    enabled: true,
  },
  {
    id: 'ex-mat-002',
    code: 'MAT_INVALID',
    name: '材料无效或过期',
    category: '材料异常',
    description: '提交的材料已过有效期或内容不符合规范',
    severity: 'medium',
    triggerCondition: '材料有效期校验不通过或OCR识别异常',
    handleType: '材料补正',
    handleSteps: ['标注问题材料', '说明无效原因', '告知重新提交要求', '确认材料接收'],
    relatedScenes: ['scene-newborn-register', 'scene-residence-permit'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 48,
    enabled: true,
  },
  {
    id: 'ex-mat-003',
    code: 'MAT_UNCLEAR',
    name: '材料不清晰或不完整',
    category: '材料异常',
    description: '扫描或上传的材料图像模糊、缺页、关键信息遮挡',
    severity: 'low',
    triggerCondition: '图像清晰度低于阈值或页数不足',
    handleType: '材料补正',
    handleSteps: ['标记具体问题区域', '说明清晰度要求', '重新扫描或上传', '二次核验'],
    relatedScenes: ['scene-newborn-allinone', 'scene-social-security-transfer'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 24,
    enabled: true,
  },
  {
    id: 'ex-mat-004',
    code: 'MAT_INCONSISTENT',
    name: '材料信息不一致',
    category: '材料异常',
    description: '多份材料之间的关键信息存在矛盾或不一致',
    severity: 'high',
    triggerCondition: '交叉校验发现姓名、证件号、日期等信息不一致',
    handleType: '信息更正',
    handleSteps: ['列出不一致的信息项', '核实真实情况', '更正或出具说明', '确认一致性'],
    relatedScenes: ['scene-newborn-register', 'scene-move-in', 'scene-household-split'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 48,
    enabled: true,
  },
  {
    id: 'ex-info-001',
    code: 'INFO_FORMAT_ERROR',
    name: '信息录入格式错误',
    category: '信息异常',
    description: '关键信息字段录入不符合格式规范',
    severity: 'low',
    triggerCondition: '正则校验不通过',
    handleType: '信息更正',
    handleSteps: ['定位错误字段', '提示格式要求', '修改录入信息', '重新校验'],
    relatedScenes: ['scene-newborn-allinone', 'scene-idcard-replace'],
    autoDetect: true,
    notifyApplicant: false,
    suggestTimeLimit: 1,
    enabled: true,
  },
  {
    id: 'ex-info-002',
    code: 'INFO_NOT_MATCH',
    name: '身份信息核验不通过',
    category: '信息异常',
    description: '申请人身份信息与公安人口库比对不匹配',
    severity: 'critical',
    triggerCondition: '调用人口信息库核验失败',
    handleType: '转特殊通道',
    handleSteps: ['暂停办件流程', '转入人工核验', '核实身份真伪', '按核验结果处理'],
    relatedScenes: ['scene-newborn-register', 'scene-idcard-makeup', 'scene-residence-permit'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 24,
    enabled: true,
  },
  {
    id: 'ex-qual-001',
    code: 'QUAL_ELIGIBILITY_FAIL',
    name: '不符合办理资格',
    category: '资格异常',
    description: '申请人不满足该业务的办理条件或资格要求',
    severity: 'high',
    triggerCondition: '资格规则引擎校验不通过',
    handleType: '退回重办',
    handleSteps: ['说明不符合的条件', '给出解决方案建议', '出具不予受理通知书', '归档记录'],
    relatedScenes: ['scene-move-in', 'scene-residence-permit'],
    autoDetect: true,
    notifyApplicant: true,
    enabled: true,
  },
  {
    id: 'ex-qual-002',
    code: 'QUAL_TIME_LIMIT',
    name: '超出办理时限',
    category: '资格异常',
    description: '业务申请已超过法定或规定的办理期限',
    severity: 'medium',
    triggerCondition: '申请时间超出业务时限要求',
    handleType: '人工干预',
    handleSteps: ['核实超期原因', '判定是否可容缺', '需审批则走特批流程', '按审批结果办理'],
    relatedScenes: ['scene-newborn-register'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 72,
    enabled: true,
  },
  {
    id: 'ex-qual-003',
    code: 'QUAL_DUPLICATE_CASE',
    name: '重复申报',
    category: '资格异常',
    description: '同一申请人就同一事项存在未办结或已办结的重复申请',
    severity: 'medium',
    triggerCondition: '重复办件检测命中',
    handleType: '人工干预',
    handleSteps: ['查询已有办件', '确认是否重复', '告知申请人', '并案或撤销处理'],
    relatedScenes: ['scene-newborn-register', 'scene-idcard-replace'],
    autoDetect: true,
    notifyApplicant: true,
    enabled: true,
  },
  {
    id: 'ex-sys-001',
    code: 'SYS_API_TIMEOUT',
    name: '系统接口调用超时',
    category: '系统异常',
    description: '调用外部部门共享接口时响应超时',
    severity: 'medium',
    triggerCondition: '接口调用耗时超过阈值',
    handleType: '系统修复',
    handleSteps: ['自动重试调用', '记录错误日志', '切换备用通道', '通知运维处理'],
    relatedScenes: ['scene-newborn-allinone', 'scene-social-security-transfer'],
    autoDetect: true,
    notifyApplicant: false,
    suggestTimeLimit: 2,
    enabled: true,
  },
  {
    id: 'ex-sys-002',
    code: 'SYS_DATA_SYNC',
    name: '数据同步异常',
    category: '系统异常',
    description: '办件数据未能成功同步至相关部门业务系统',
    severity: 'high',
    triggerCondition: '消息队列消费失败或同步回执异常',
    handleType: '系统修复',
    handleSteps: ['触发补偿同步', '人工确认同步状态', '重传数据', '记录并跟进'],
    relatedScenes: ['scene-newborn-allinone', 'scene-newborn-register'],
    autoDetect: true,
    notifyApplicant: false,
    suggestTimeLimit: 4,
    enabled: true,
  },
  {
    id: 'ex-biz-001',
    code: 'BIZ_SPECIAL_CASE',
    name: '特殊情形需人工判定',
    category: '业务异常',
    description: '业务办理中出现规则无法覆盖的特殊情形',
    severity: 'medium',
    triggerCondition: '规则引擎无匹配规则',
    handleType: '人工干预',
    handleSteps: ['标记特殊情形', '提交业务主管判定', '按判定结果处理', '补充规则库'],
    relatedScenes: ['scene-newborn-allinone', 'scene-household-split'],
    autoDetect: false,
    notifyApplicant: true,
    suggestTimeLimit: 24,
    enabled: true,
  },
  {
    id: 'ex-biz-002',
    code: 'BIZ_CROSS_DEPT',
    name: '跨部门协同阻塞',
    category: '业务异常',
    description: '联办事项中某部门办理超时或返回异常',
    severity: 'high',
    triggerCondition: '联办节点超时或返回错误状态',
    handleType: '人工干预',
    handleSteps: ['定位阻塞节点', '联系对应部门协调', '启动催办机制', '跟踪办理进度'],
    relatedScenes: ['scene-newborn-allinone', 'scene-social-security-transfer'],
    autoDetect: true,
    notifyApplicant: true,
    suggestTimeLimit: 12,
    enabled: true,
  },
  {
    id: 'ex-other-001',
    code: 'OTHER_APPLICANT_ABSENT',
    name: '申请人离场未完成办理',
    category: '其他异常',
    description: '叫号后申请人未到场或中途离开未完成办理',
    severity: 'low',
    triggerCondition: '叫号后超时未响应或窗口标记离场',
    handleType: '退回重办',
    handleSteps: ['标记过号或离场', '可安排重新取号', '保留申请记录', '通知下次办理'],
    relatedScenes: ['scene-newborn-register', 'scene-idcard-replace'],
    autoDetect: false,
    notifyApplicant: true,
    enabled: true,
  },
];

// 异常分类下拉
export const exceptionCategoryList: ComboItem[] = [
  { label: '全部', value: 'all' },
  { label: '材料异常', value: '材料异常' },
  { label: '信息异常', value: '信息异常' },
  { label: '资格异常', value: '资格异常' },
  { label: '系统异常', value: '系统异常' },
  { label: '业务异常', value: '业务异常' },
  { label: '其他异常', value: '其他异常' },
];

// 严重级别配置
export const severityConfig: Record<SeverityLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: '低', color: '#52c41a', bgColor: '#f6ffed' },
  medium: { label: '中', color: '#fa8c16', bgColor: '#fff7e6' },
  high: { label: '高', color: '#f5222d', bgColor: '#fff1f0' },
  critical: { label: '严重', color: '#820014', bgColor: '#fff1f0' },
};

// 根据分类获取异常列表
export const getExceptionsByCategory = (category: string): ExceptionConfig[] => {
  if (category === 'all') return exceptionConfigList.filter((e) => e.enabled);
  return exceptionConfigList.filter((e) => e.category === category && e.enabled);
};

// 根据ID获取异常配置
export const getExceptionById = (id: string): ExceptionConfig | undefined => {
  return exceptionConfigList.find((e) => e.id === id);
};

// 根据关联场景获取异常列表
export const getExceptionsByScene = (sceneId: string): ExceptionConfig[] => {
  return exceptionConfigList.filter((e) => e.relatedScenes.includes(sceneId) && e.enabled);
};

export default exceptionConfigList;
