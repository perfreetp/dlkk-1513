// 生成流水号的前缀类型
export type PrefixType =
  | 'CASE' // 办件编号
  | 'SL' // 受理流水号
  | 'Q' // 取号流水号
  | 'MAT' // 材料ID
  | 'FLOW' // 流转记录ID
  | 'SUPP' // 补正通知ID
  | 'REJ'; // 退件单ID

// 生成随机字符串（字母+数字）
const randomStr = (len: number, onlyNum = false): string => {
  const chars = onlyNum
    ? '0123456789'
    : 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 获取当前日期 YYYYMMDD
const getDateStr = (date?: Date): string => {
  const d = date || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
};

// 获取当前时间 HHmmssSSS
const getTimeStr = (date?: Date): string => {
  const d = date || new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${h}${m}${s}${ms}`;
};

// 生成办件编号 CASE+YYYYMMDD+4位序号
// 示例：CASE202606180001
let caseSeq = 1;
export const genCaseId = (reset = false): string => {
  if (reset) caseSeq = 1;
  const seq = String(caseSeq++).padStart(4, '0');
  return `CASE${getDateStr()}${seq}`;
};

// 生成受理流水号 SL+YYYYMMDD+6位序号
// 示例：SL20260618000001
let serialSeq = 1;
export const genSerialNo = (reset = false): string => {
  if (reset) serialSeq = 1;
  const seq = String(serialSeq++).padStart(6, '0');
  return `SL${getDateStr()}${seq}`;
};

// 生成叫号号码
// 示例：A001、B023、C105
export const genQueueNo = (queueType: 'A' | 'B' | 'C' = 'A', seq: number): string => {
  const seqStr = String(seq).padStart(3, '0');
  return `${queueType}${seqStr}`;
};

// 生成队列ID Q+YYYYMMDDHHmmss+3位随机
export const genQueueId = (): string => {
  return `Q${getDateStr()}${getTimeStr().slice(0, 6)}${randomStr(3, true)}`;
};

// 生成材料ID MAT+YYYYMMDD+5位随机
export const genMaterialId = (): string => {
  return `MAT${getDateStr()}${randomStr(5, true)}`;
};

// 生成流转记录ID FLOW+时间戳+3位随机
export const genFlowRecordId = (): string => {
  return `FLOW${Date.now()}${randomStr(3, true)}`;
};

// 生成补正通知ID SUPP+YYYYMMDD+4位序号
let suppSeq = 1;
export const genSupplementId = (reset = false): string => {
  if (reset) suppSeq = 1;
  const seq = String(suppSeq++).padStart(4, '0');
  return `SUPP${getDateStr()}${seq}`;
};

// 生成退件单ID REJ+YYYYMMDD+4位序号
let rejSeq = 1;
export const genRejectId = (reset = false): string => {
  if (reset) rejSeq = 1;
  const seq = String(rejSeq++).padStart(4, '0');
  return `REJ${getDateStr()}${seq}`;
};

// 通用ID生成器 前缀+日期+自定义位数随机
export const genId = (prefix: PrefixType = 'CASE', randomLen = 6): string => {
  return `${prefix}${getDateStr()}${randomStr(randomLen)}`;
};

// 生成UUID（简化版，不依赖库）
export const genUUID = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart1 = randomStr(4);
  const randomPart2 = randomStr(4);
  const randomPart3 = randomStr(4);
  const randomPart4 = randomStr(12);
  return `${timestamp}-${randomPart1}-${randomPart2}-${randomPart3}-${randomPart4}`;
};

// 生成短ID（用于非关键场景）
export const genShortId = (len = 8): string => {
  return randomStr(len);
};

// 生成验证码（纯数字）
export const genVerifyCode = (len = 6): string => {
  return randomStr(len, true);
};

// 生成业务编码（场景码+日期+序号）
export const genBizCode = (sceneCode: string, seq: number): string => {
  const seqStr = String(seq).padStart(4, '0');
  return `${sceneCode}-${getDateStr()}-${seqStr}`;
};

// 重置所有序列号（用于测试）
export const resetAllSeq = (): void => {
  caseSeq = 1;
  serialSeq = 1;
  suppSeq = 1;
  rejSeq = 1;
};

export default {
  genCaseId,
  genSerialNo,
  genQueueNo,
  genQueueId,
  genMaterialId,
  genFlowRecordId,
  genSupplementId,
  genRejectId,
  genId,
  genUUID,
  genShortId,
  genVerifyCode,
  genBizCode,
  resetAllSeq,
};
