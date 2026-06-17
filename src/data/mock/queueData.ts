import type { QueueItem } from '../../types';

// 叫号队列模拟数据（10条左右）
export const queueDataList: QueueItem[] = [
  {
    id: 'q-20260618-001',
    queueNo: 'A001',
    queueType: 'A',
    sceneName: '新生儿出生一件事（全流程联办）',
    applicantName: '王*明',
    waitCount: 0,
    waitTime: 0,
    windowNo: '1号窗口',
    status: 'calling',
    calledTime: '2026-06-18 09:15:00',
    arriveTime: '2026-06-18 09:02:15',
  },
  {
    id: 'q-20260618-002',
    queueNo: 'A002',
    queueType: 'A',
    sceneName: '新生儿上户口',
    applicantName: '李*华',
    waitCount: 1,
    waitTime: 15,
    status: 'waiting',
    arriveTime: '2026-06-18 09:05:30',
  },
  {
    id: 'q-20260618-003',
    queueNo: 'A003',
    queueType: 'A',
    sceneName: '新生儿医保社保联办',
    applicantName: '张*丽',
    waitCount: 2,
    waitTime: 30,
    status: 'waiting',
    arriveTime: '2026-06-18 09:08:45',
  },
  {
    id: 'q-20260618-004',
    queueNo: 'B001',
    queueType: 'B',
    sceneName: '夫妻投靠落户',
    applicantName: '陈*军',
    waitCount: 0,
    waitTime: 0,
    windowNo: '2号窗口',
    status: 'handling',
    calledTime: '2026-06-18 09:10:00',
    arriveTime: '2026-06-18 08:55:20',
  },
  {
    id: 'q-20260618-005',
    queueNo: 'B002',
    queueType: 'B',
    sceneName: '分户立户办理',
    applicantName: '刘*芳',
    waitCount: 1,
    waitTime: 20,
    status: 'waiting',
    arriveTime: '2026-06-18 09:12:00',
  },
  {
    id: 'q-20260618-006',
    queueNo: 'B003',
    queueType: 'B',
    sceneName: '社保转移',
    applicantName: '赵*强',
    waitCount: 2,
    waitTime: 35,
    status: 'waiting',
    arriveTime: '2026-06-18 09:15:30',
  },
  {
    id: 'q-20260618-007',
    queueNo: 'C001',
    queueType: 'C',
    sceneName: '身份证换领',
    applicantName: '孙*伟',
    waitCount: 0,
    waitTime: 0,
    windowNo: '3号窗口',
    status: 'calling',
    calledTime: '2026-06-18 09:16:30',
    arriveTime: '2026-06-18 09:06:50',
  },
  {
    id: 'q-20260618-008',
    queueNo: 'C002',
    queueType: 'C',
    sceneName: '居住证办理',
    applicantName: '周*红',
    waitCount: 1,
    waitTime: 15,
    status: 'waiting',
    arriveTime: '2026-06-18 09:10:15',
  },
  {
    id: 'q-20260618-009',
    queueNo: 'C003',
    queueType: 'C',
    sceneName: '身份证补领',
    applicantName: '吴*磊',
    waitCount: 2,
    waitTime: 25,
    status: 'waiting',
    arriveTime: '2026-06-18 09:14:00',
  },
  {
    id: 'q-20260618-010',
    queueNo: 'A004',
    queueType: 'A',
    sceneName: '预防接种证办理',
    applicantName: '郑*婷',
    waitCount: 3,
    waitTime: 40,
    status: 'waiting',
    arriveTime: '2026-06-18 09:18:20',
  },
  {
    id: 'q-20260618-011',
    queueNo: 'B004',
    queueType: 'B',
    sceneName: '夫妻投靠落户',
    applicantName: '冯*亮',
    waitCount: 3,
    waitTime: 40,
    status: 'waiting',
    arriveTime: '2026-06-18 09:20:00',
  },
  {
    id: 'q-20260618-012',
    queueNo: 'C004',
    queueType: 'C',
    sceneName: '居住证办理',
    applicantName: '黄*燕',
    waitCount: 3,
    waitTime: 35,
    status: 'waiting',
    arriveTime: '2026-06-18 09:22:30',
  },
];

// 各队列类型等待统计
export const queueWaitStats = {
  A: {
    typeName: 'A类（出生登记类）',
    waitingCount: 4,
    avgWaitTime: 28,
    handlingCount: 1,
    callingCount: 1,
  },
  B: {
    typeName: 'B类（户口迁移/社保类）',
    waitingCount: 4,
    avgWaitTime: 30,
    handlingCount: 1,
    callingCount: 0,
  },
  C: {
    typeName: 'C类（证件办理类）',
    waitingCount: 3,
    avgWaitTime: 25,
    handlingCount: 0,
    callingCount: 1,
  },
};

// 根据状态获取队列
export const getQueueByStatus = (status: QueueItem['status']): QueueItem[] => {
  return queueDataList.filter((q) => q.status === status);
};

// 根据队列类型获取队列
export const getQueueByType = (queueType: QueueItem['queueType']): QueueItem[] => {
  return queueDataList.filter((q) => q.queueType === queueType);
};

// 获取等待中的队列（按到达时间排序）
export const getWaitingQueue = (): QueueItem[] => {
  return queueDataList
    .filter((q) => q.status === 'waiting')
    .sort((a, b) => (a.arriveTime || '').localeCompare(b.arriveTime || ''));
};

// 获取当前叫号/办理中的队列
export const getActiveQueue = (): QueueItem[] => {
  return queueDataList.filter((q) => q.status === 'calling' || q.status === 'handling');
};

export default queueDataList;
