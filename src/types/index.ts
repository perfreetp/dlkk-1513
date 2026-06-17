// 人员类型
export type PersonType = 'father' | 'mother' | 'newborn' | 'other';

// 办件状态
export type CaseStatus =
  | 'pending' // 待受理
  | 'accepting' // 受理中
  | 'supplement' // 材料补正
  | 'reviewing' // 审核中
  | 'approved' // 已通过
  | 'rejected' // 已退件
  | 'completed'; // 已完成

// 下拉/选择项通用结构
export interface ComboItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// 新生儿信息
export interface NewbornInfo {
  name?: string; // 姓名
  gender?: '男' | '女'; // 性别
  birthDate?: string; // 出生日期
  birthTime?: string; // 出生时间
  birthPlace?: string; // 出生地点
  healthStatus?: string; // 健康状况
  idCardNo?: string; // 身份证号（登记后生成）
}

// 父母信息
export interface ParentInfo {
  relation: 'father' | 'mother' | 'other'; // 亲属关系
  name: string; // 姓名
  idCardType: string; // 证件类型
  idCardNo: string; // 证件号码
  phone: string; // 联系电话
  nationality?: string; // 国籍
  ethnicity?: string; // 民族
  address?: string; // 户籍地址
  education?: string; // 文化程度
  occupation?: string; // 职业
}

// 材料项
export interface MaterialItem {
  id: string; // 材料ID
  name: string; // 材料名称
  required: boolean; // 是否必收
  category: '证件类' | '证明类' | '表单类' | '其他'; // 材料分类
  status: '未提交' | '已提交' | '已核验' | '需补正'; // 材料状态
  uploadCount?: number; // 已上传份数
  remark?: string; // 备注
  supplementReason?: string; // 补正原因
}

// 办件信息
export interface CaseInfo {
  caseId: string; // 办件编号
  serialNo: string; // 流水号
  sceneId: string; // 场景ID
  sceneName: string; // 场景名称
  status: CaseStatus; // 办件状态
  statusText: string; // 状态文字
  applicantName: string; // 申请人姓名
  applicantPhone: string; // 申请人电话
  handler?: string; // 经办人
  acceptTime?: string; // 受理时间
  expectedTime?: string; // 预计完成时间
  completeTime?: string; // 实际完成时间
  newborn?: NewbornInfo; // 新生儿信息
  parents?: ParentInfo[]; // 父母信息
  materials?: MaterialItem[]; // 材料清单
  flowRecords?: FlowRecord[]; // 流转记录
  rejectReason?: string; // 退件原因
  supplementCount?: number; // 补正次数
  tag?: string; // 标签（如：加急、联办）
  priority?: number; // 优先级
}

// 流转记录
export interface FlowRecord {
  id: string; // 记录ID
  node: string; // 节点名称
  operator: string; // 操作人
  operateTime: string; // 操作时间
  action: string; // 操作动作
  remark?: string; // 备注
}

// 叫号队列项
export interface QueueItem {
  id: string; // 队列ID
  queueNo: string; // 号码（如 A001）
  queueType: 'A' | 'B' | 'C'; // 队列类型
  sceneName: string; // 办理场景
  applicantName: string; // 办理人姓名
  waitCount: number; // 前面等待人数
  waitTime: number; // 预计等待时间（分钟）
  windowNo?: string; // 窗口号
  status: 'waiting' | 'calling' | 'handling' | 'completed' | 'passed';
  calledTime?: string; // 叫号时间
  arriveTime?: string; // 取号时间
}

// 每日统计
export interface DailyStats {
  date: string; // 日期 YYYY-MM-DD
  totalCases: number; // 总办件数
  completedCases: number; // 已完成数
  rejectedCases: number; // 退件数
  supplementCases: number; // 补正数
  avgHandleTime: number; // 平均办理时长（分钟）
}

// 退件原因统计
export interface ReturnReasonStat {
  reason: string; // 原因
  count: number; // 数量
  percentage: number; // 占比
  category: '材料' | '信息' | '资格' | '系统' | '其他'; // 分类
}
