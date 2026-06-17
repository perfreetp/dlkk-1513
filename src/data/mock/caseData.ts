import type { CaseInfo, FlowRecord } from '../../types';

// 流转记录生成器
const createFlowRecords = (caseId: string): FlowRecord[] => {
  return [
    {
      id: `${caseId}-flow-1`,
      node: '取号登记',
      operator: '系统',
      operateTime: '2026-06-18 09:02:15',
      action: '取号成功',
      remark: '自助终端取号',
    },
    {
      id: `${caseId}-flow-2`,
      node: '窗口受理',
      operator: '张经办',
      operateTime: '2026-06-18 09:15:30',
      action: '开始受理',
      remark: '1号窗口',
    },
  ];
};

// 办件模拟数据
export const caseDataList: CaseInfo[] = [
  {
    caseId: 'CASE202606180001',
    serialNo: 'SL20260618000001',
    sceneId: 'scene-newborn-allinone',
    sceneName: '新生儿出生一件事（全流程联办）',
    status: 'accepting',
    statusText: '受理中',
    applicantName: '王*明',
    applicantPhone: '138****1234',
    handler: '张经办',
    acceptTime: '2026-06-18 09:15:30',
    expectedTime: '2026-06-18 10:00:00',
    newborn: {
      name: '王*阳',
      gender: '男',
      birthDate: '2026-06-10',
      birthTime: '14:25',
      birthPlace: '市妇幼保健院',
      healthStatus: '健康',
    },
    parents: [
      {
        relation: 'father',
        name: '王*明',
        idCardType: '居民身份证',
        idCardNo: '330102********1234',
        phone: '138****1234',
        nationality: '中国',
        ethnicity: '汉族',
        address: '杭州市西湖区文三路100号',
        education: '大学本科',
        occupation: '工程师',
      },
      {
        relation: 'mother',
        name: '李*',
        idCardType: '居民身份证',
        idCardNo: '330103********5678',
        phone: '139****5678',
        nationality: '中国',
        ethnicity: '汉族',
        address: '杭州市西湖区文三路100号',
        education: '硕士研究生',
        occupation: '教师',
      },
    ],
    supplementCount: 0,
    tag: '联办',
    priority: 1,
    flowRecords: createFlowRecords('CASE202606180001'),
  },
  {
    caseId: 'CASE202606180002',
    serialNo: 'SL20260618000002',
    sceneId: 'scene-newborn-register',
    sceneName: '新生儿上户口',
    status: 'reviewing',
    statusText: '审核中',
    applicantName: '李*华',
    applicantPhone: '137****2222',
    handler: '王经办',
    acceptTime: '2026-06-18 08:45:00',
    expectedTime: '2026-06-18 09:30:00',
    newborn: {
      name: '李*琪',
      gender: '女',
      birthDate: '2026-06-05',
      birthTime: '08:30',
      birthPlace: '市第一人民医院',
      healthStatus: '健康',
    },
    parents: [
      {
        relation: 'father',
        name: '李*华',
        idCardType: '居民身份证',
        idCardNo: '330106********3333',
        phone: '137****2222',
        nationality: '中国',
        ethnicity: '汉族',
        address: '杭州市上城区庆春路200号',
      },
      {
        relation: 'mother',
        name: '陈*',
        idCardType: '居民身份证',
        idCardNo: '330104********4444',
        phone: '136****3333',
        nationality: '中国',
        ethnicity: '汉族',
        address: '杭州市上城区庆春路200号',
      },
    ],
    supplementCount: 0,
    priority: 2,
    flowRecords: [
      {
        id: 'CASE202606180002-flow-1',
        node: '取号登记',
        operator: '系统',
        operateTime: '2026-06-18 08:30:00',
        action: '取号成功',
      },
      {
        id: 'CASE202606180002-flow-2',
        node: '窗口受理',
        operator: '王经办',
        operateTime: '2026-06-18 08:45:00',
        action: '材料核验通过',
      },
      {
        id: 'CASE202606180002-flow-3',
        node: '审核审批',
        operator: '系统推送',
        operateTime: '2026-06-18 09:00:00',
        action: '推送公安人口系统',
        remark: '等待审核回执',
      },
    ],
  },
  {
    caseId: 'CASE202606180003',
    serialNo: 'SL20260618000003',
    sceneId: 'scene-newborn-insurance',
    sceneName: '新生儿医保社保联办',
    status: 'supplement',
    statusText: '材料补正',
    applicantName: '张*丽',
    applicantPhone: '135****6666',
    handler: '刘经办',
    acceptTime: '2026-06-18 09:05:00',
    expectedTime: '2026-06-18 10:00:00',
    newborn: {
      name: '张*熙',
      gender: '男',
      birthDate: '2026-06-01',
      birthPlace: '市第二人民医院',
      healthStatus: '健康',
    },
    parents: [
      {
        relation: 'father',
        name: '张*',
        idCardType: '居民身份证',
        idCardNo: '330105********5555',
        phone: '135****6666',
        address: '杭州市滨江区江南大道500号',
      },
      {
        relation: 'mother',
        name: '赵*丽',
        idCardType: '居民身份证',
        idCardNo: '330108********6666',
        phone: '134****7777',
        address: '杭州市滨江区江南大道500号',
      },
    ],
    supplementCount: 1,
    tag: '补正中',
    priority: 3,
    rejectReason: '银行卡复印件不清晰，请重新提交',
    flowRecords: [
      {
        id: 'CASE202606180003-flow-1',
        node: '取号登记',
        operator: '系统',
        operateTime: '2026-06-18 08:55:00',
        action: '取号成功',
      },
      {
        id: 'CASE202606180003-flow-2',
        node: '窗口受理',
        operator: '刘经办',
        operateTime: '2026-06-18 09:05:00',
        action: '发起补正通知',
        remark: '银行卡复印件模糊不清',
      },
    ],
  },
  {
    caseId: 'CASE202606180004',
    serialNo: 'SL20260618000004',
    sceneId: 'scene-move-in',
    sceneName: '夫妻投靠落户',
    status: 'completed',
    statusText: '已完成',
    applicantName: '陈*军',
    applicantPhone: '133****8888',
    handler: '赵经办',
    acceptTime: '2026-06-17 14:20:00',
    expectedTime: '2026-06-17 15:10:00',
    completeTime: '2026-06-17 15:05:00',
    parents: [
      {
        relation: 'father',
        name: '陈*军',
        idCardType: '居民身份证',
        idCardNo: '330101********7777',
        phone: '133****8888',
        address: '杭州市拱墅区莫干山路300号',
      },
    ],
    supplementCount: 0,
    priority: 4,
    flowRecords: [
      {
        id: 'CASE202606180004-flow-1',
        node: '取号登记',
        operator: '系统',
        operateTime: '2026-06-17 14:00:00',
        action: '取号成功',
      },
      {
        id: 'CASE202606180004-flow-2',
        node: '窗口受理',
        operator: '赵经办',
        operateTime: '2026-06-17 14:20:00',
        action: '受理完成',
      },
      {
        id: 'CASE202606180004-flow-3',
        node: '审核审批',
        operator: '系统',
        operateTime: '2026-06-17 14:45:00',
        action: '审核通过',
      },
      {
        id: 'CASE202606180004-flow-4',
        node: '证件打制',
        operator: '系统',
        operateTime: '2026-06-17 15:00:00',
        action: '户口簿打印完成',
      },
      {
        id: 'CASE202606180004-flow-5',
        node: '办结送达',
        operator: '赵经办',
        operateTime: '2026-06-17 15:05:00',
        action: '办件完成',
        remark: '申请人已签收',
      },
    ],
  },
  {
    caseId: 'CASE202606180005',
    serialNo: 'SL20260618000005',
    sceneId: 'scene-idcard-replace',
    sceneName: '居民身份证换领',
    status: 'approved',
    statusText: '已通过',
    applicantName: '孙*伟',
    applicantPhone: '132****9999',
    handler: '周经办',
    acceptTime: '2026-06-18 09:20:00',
    expectedTime: '2026-06-18 09:45:00',
    parents: [
      {
        relation: 'other',
        name: '孙*伟',
        idCardType: '居民身份证',
        idCardNo: '330103********8888',
        phone: '132****9999',
        address: '杭州市下城区延安路400号',
      },
    ],
    supplementCount: 0,
    priority: 5,
    flowRecords: [
      {
        id: 'CASE202606180005-flow-1',
        node: '取号登记',
        operator: '系统',
        operateTime: '2026-06-18 09:06:50',
        action: '取号成功',
      },
      {
        id: 'CASE202606180005-flow-2',
        node: '窗口受理',
        operator: '周经办',
        operateTime: '2026-06-18 09:20:00',
        action: '信息核验通过',
      },
      {
        id: 'CASE202606180005-flow-3',
        node: '审核审批',
        operator: '系统',
        operateTime: '2026-06-18 09:30:00',
        action: '公安制证中心已接收',
      },
    ],
  },
  {
    caseId: 'CASE202606180006',
    serialNo: 'SL20260618000006',
    sceneId: 'scene-residence-permit',
    sceneName: '居住证办理',
    status: 'rejected',
    statusText: '已退件',
    applicantName: '周*红',
    applicantPhone: '131****1111',
    handler: '吴经办',
    acceptTime: '2026-06-18 09:12:00',
    expectedTime: '2026-06-18 09:40:00',
    parents: [
      {
        relation: 'other',
        name: '周*红',
        idCardType: '居民身份证',
        idCardNo: '420102********9999',
        phone: '131****1111',
        address: '杭州市江干区钱江路600号',
      },
    ],
    supplementCount: 2,
    rejectReason: '居住登记未满半年，不符合办理条件，请登记满6个月后再来办理',
    priority: 6,
    flowRecords: [
      {
        id: 'CASE202606180006-flow-1',
        node: '取号登记',
        operator: '系统',
        operateTime: '2026-06-18 09:10:15',
        action: '取号成功',
      },
      {
        id: 'CASE202606180006-flow-2',
        node: '窗口受理',
        operator: '吴经办',
        operateTime: '2026-06-18 09:12:00',
        action: '资格校验不通过',
        remark: '居住登记时间不足',
      },
      {
        id: 'CASE202606180006-flow-3',
        node: '办结送达',
        operator: '吴经办',
        operateTime: '2026-06-18 09:20:00',
        action: '出具不予受理通知书',
      },
    ],
  },
  {
    caseId: 'CASE202606180007',
    serialNo: 'SL20260618000007',
    sceneId: 'scene-household-split',
    sceneName: '分户立户办理',
    status: 'pending',
    statusText: '待受理',
    applicantName: '刘*芳',
    applicantPhone: '130****2222',
    acceptTime: undefined,
    expectedTime: undefined,
    parents: [
      {
        relation: 'other',
        name: '刘*芳',
        idCardType: '居民身份证',
        idCardNo: '330104********0000',
        phone: '130****2222',
        address: '杭州市萧山区市心北路800号',
      },
    ],
    supplementCount: 0,
    priority: 7,
  },
];

// 办件状态统计
export const caseStatusStats = {
  pending: { label: '待受理', count: 1, color: '#8c8c8c' },
  accepting: { label: '受理中', count: 1, color: '#1677ff' },
  supplement: { label: '材料补正', count: 1, color: '#fa8c16' },
  reviewing: { label: '审核中', count: 1, color: '#722ed1' },
  approved: { label: '已通过', count: 1, color: '#52c41a' },
  rejected: { label: '已退件', count: 1, color: '#f5222d' },
  completed: { label: '已完成', count: 1, color: '#13c2c2' },
};

// 根据状态获取办件列表
export const getCasesByStatus = (status: CaseInfo['status']): CaseInfo[] => {
  return caseDataList.filter((c) => c.status === status);
};

// 根据场景ID获取办件列表
export const getCasesByScene = (sceneId: string): CaseInfo[] => {
  return caseDataList.filter((c) => c.sceneId === sceneId);
};

// 根据办件编号获取办件
export const getCaseById = (caseId: string): CaseInfo | undefined => {
  return caseDataList.find((c) => c.caseId === caseId);
};

// 搜索办件
export const searchCases = (keyword: string): CaseInfo[] => {
  const kw = keyword.toLowerCase();
  return caseDataList.filter(
    (c) =>
      c.caseId.toLowerCase().includes(kw) ||
      c.applicantName.toLowerCase().includes(kw) ||
      c.sceneName.toLowerCase().includes(kw) ||
      c.applicantPhone.includes(kw),
  );
};

export default caseDataList;
