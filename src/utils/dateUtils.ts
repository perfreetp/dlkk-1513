// 日期格式化选项
export interface FormatOptions {
  withTime?: boolean; // 是否包含时间
  separator?: string; // 日期分隔符，默认 '-'
  timeSeparator?: string; // 时间分隔符，默认 ':'
  padZero?: boolean; // 是否补零，默认 true
}

// 倒计时结果
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalSeconds: number;
}

// 补零
const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

// 格式化日期
export const formatDate = (date: Date | string | number | undefined, options: FormatOptions = {}): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const { withTime = false, separator = '-', timeSeparator = ':', padZero = true } = options;
  const year = d.getFullYear();
  const month = padZero ? pad(d.getMonth() + 1) : String(d.getMonth() + 1);
  const day = padZero ? pad(d.getDate()) : String(d.getDate());

  let result = `${year}${separator}${month}${separator}${day}`;

  if (withTime) {
    const hour = padZero ? pad(d.getHours()) : String(d.getHours());
    const minute = padZero ? pad(d.getMinutes()) : String(d.getMinutes());
    const second = padZero ? pad(d.getSeconds()) : String(d.getSeconds());
    result += ` ${hour}${timeSeparator}${minute}${timeSeparator}${second}`;
  }

  return result;
};

// 获取当前日期字符串 YYYY-MM-DD
export const getToday = (separator = '-'): string => {
  return formatDate(new Date(), { separator });
};

// 获取当前日期时间字符串 YYYY-MM-DD HH:mm:ss
export const getNow = (separator = '-', timeSeparator = ':'): string => {
  return formatDate(new Date(), { withTime: true, separator, timeSeparator });
};

// 获取日期部分（去掉时间）
export const getDatePart = (date: Date | string | number): string => {
  return formatDate(date);
};

// 获取时间部分
export const getTimePart = (date: Date | string | number, separator = ':'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${pad(d.getHours())}${separator}${pad(d.getMinutes())}${separator}${pad(d.getSeconds())}`;
};

// 倒计时计算（目标时间到当前时间的差）
export const getCountdown = (targetTime: Date | string | number): CountdownResult => {
  const target = new Date(targetTime).getTime();
  const now = Date.now();
  let diff = target - now;
  const expired = diff <= 0;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired, totalSeconds };
};

// 格式化倒计时显示
export const formatCountdown = (cd: CountdownResult, compact = false): string => {
  if (cd.expired) return '已过期';
  const parts: string[] = [];
  if (cd.days > 0) parts.push(`${cd.days}天`);
  if (cd.hours > 0) parts.push(`${cd.hours}小时`);
  if (cd.minutes > 0) parts.push(`${cd.minutes}分`);
  if (!compact && cd.seconds >= 0) parts.push(`${cd.seconds}秒`);
  return parts.length > 0 ? parts.join('') : '即将到期';
};

// 计算两个日期的天数差
export const diffDays = (start: Date | string | number, end: Date | string | number): number => {
  const s = new Date(getDatePart(start)).getTime();
  const e = new Date(getDatePart(end)).getTime();
  return Math.round((e - s) / 86400000);
};

// 计算两个日期的分钟差
export const diffMinutes = (start: Date | string | number, end: Date | string | number): number => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.round((e - s) / 60000);
};

// 格式化时长（分钟数转成 x小时y分）
export const formatDuration = (minutes: number): string => {
  if (minutes <= 0) return '0分钟';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}小时`);
  if (mins > 0) parts.push(`${mins}分钟`);
  return parts.join('');
};

// 相对时间描述（刚刚、x分钟前、x小时前等）
export const getRelativeTime = (date: Date | string | number): string => {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  if (diff < 0) return '时间异常';

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return sec <= 5 ? '刚刚' : `${sec}秒前`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}小时前`;

  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}天前`;

  const week = Math.floor(day / 7);
  if (week < 4) return `${week}周前`;

  const month = Math.floor(day / 30);
  if (month < 12) return `${month}个月前`;

  const year = Math.floor(day / 365);
  return `${year}年前`;
};

// 日期脱敏（生日等显示为YYYY年**月**日）
export const maskDate = (date: Date | string | number, pattern: 'date' | 'datetime' = 'date'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  if (pattern === 'date') {
    return `${year}年**月**日`;
  }
  return `${year}年**月**日 **:**:**`;
};

// 周几
export const getWeekday = (date: Date | string | number, format: 'zh' | 'short' | 'en' = 'zh'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDay();
  if (format === 'zh') {
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day];
  } else if (format === 'short') {
    return ['日', '一', '二', '三', '四', '五', '六'][day];
  } else {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  }
};

// 日期加天数
export const addDays = (date: Date | string | number, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// 日期加分钟
export const addMinutes = (date: Date | string | number, minutes: number): Date => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

// 判断是否为今天
export const isToday = (date: Date | string | number): boolean => {
  return getDatePart(date) === getDatePart(new Date());
};

// 判断是否为工作日（周一到周五）
export const isWorkday = (date: Date | string | number): boolean => {
  const day = new Date(date).getDay();
  return day >= 1 && day <= 5;
};

// 获取近n天日期数组
export const getRecentDays = (n: number, endDate: Date = new Date()): string[] => {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(formatDate(addDays(endDate, -i)));
  }
  return result;
};

export default {
  formatDate,
  getToday,
  getNow,
  getDatePart,
  getTimePart,
  getCountdown,
  formatCountdown,
  diffDays,
  diffMinutes,
  formatDuration,
  getRelativeTime,
  maskDate,
  getWeekday,
  addDays,
  addMinutes,
  isToday,
  isWorkday,
  getRecentDays,
};
