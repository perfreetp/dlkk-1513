// 校验结果
export interface ValidateResult {
  valid: boolean; // 是否通过
  message: string; // 提示信息
}

// 成功结果
const success: ValidateResult = { valid: true, message: '' };

// 失败结果
const fail = (message: string): ValidateResult => ({ valid: false, message });

// 身份证校验（18位大陆居民身份证）
export const validateIdCard = (idCard: string): ValidateResult => {
  if (!idCard || idCard.trim() === '') {
    return fail('身份证号不能为空');
  }
  const card = idCard.trim().toUpperCase();

  if (!/^\d{17}(\d|X)$/.test(card)) {
    return fail('身份证号格式不正确，应为18位数字或最后一位为X');
  }

  // 出生日期校验
  const year = parseInt(card.substring(6, 10), 10);
  const month = parseInt(card.substring(10, 12), 10);
  const day = parseInt(card.substring(12, 14), 10);
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() + 1 !== month ||
    birthDate.getDate() !== day
  ) {
    return fail('身份证号中的出生日期不合法');
  }

  // 年份范围校验
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return fail('身份证号中的出生年份不合法');
  }

  // 校验码（ISO 7064:1983.MOD 11-2）
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(card[i], 10) * weights[i];
  }
  const expectedCode = checkCodes[sum % 11];
  if (card[17] !== expectedCode) {
    return fail('身份证号校验码错误，请核实');
  }

  // 行政区划简单校验（前6位不能全为0）
  if (card.substring(0, 6) === '000000') {
    return fail('身份证号中的行政区划代码不合法');
  }

  return success;
};

// 从身份证解析信息
export interface IdCardInfo {
  gender: '男' | '女';
  birthDate: string; // YYYY-MM-DD
  age: number;
  provinceCode: string;
}

export const parseIdCard = (idCard: string): IdCardInfo | null => {
  const result = validateIdCard(idCard);
  if (!result.valid) return null;
  const card = idCard.trim();
  const year = parseInt(card.substring(6, 10), 10);
  const month = parseInt(card.substring(10, 12), 10);
  const day = parseInt(card.substring(12, 14), 10);
  const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const genderCode = parseInt(card[16], 10);
  const age = new Date().getFullYear() - year;
  return {
    gender: genderCode % 2 === 0 ? '女' : '男',
    birthDate,
    age,
    provinceCode: card.substring(0, 2),
  };
};

// 手机号校验（中国大陆手机号）
export const validatePhone = (phone: string): ValidateResult => {
  if (!phone || phone.trim() === '') {
    return fail('手机号不能为空');
  }
  const p = phone.trim().replace(/\s|-/g, '');
  if (!/^1\d{10}$/.test(p)) {
    return fail('手机号格式不正确，应为11位数字且以1开头');
  }
  // 号段校验（常见号段：130-139, 145,147,149, 150-153,155-159, 162,165,166,167, 170-178, 180-189, 191,193,195,198,199）
  if (!/^1(3\d|4[579]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[13589])\d{8}$/.test(p)) {
    return fail('手机号号段不支持，请核实号码是否正确');
  }
  return success;
};

// 手机号脱敏（138****1234）
export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const p = phone.trim().replace(/\s|-/g, '');
  if (p.length < 7) return p;
  return `${p.substring(0, 3)}****${p.substring(p.length - 4)}`;
};

// 身份证脱敏（3301**********1234）
export const maskIdCard = (idCard: string): string => {
  if (!idCard) return '';
  const card = idCard.trim();
  if (card.length <= 8) return card;
  if (card.length === 18) {
    return `${card.substring(0, 4)}**********${card.substring(14)}`;
  }
  return `${card.substring(0, 4)}${'*'.repeat(card.length - 8)}${card.substring(card.length - 4)}`;
};

// 姓名脱敏（王*明、欧阳**）
export const maskName = (name: string): string => {
  if (!name) return '';
  const n = name.trim();
  if (n.length === 1) return n;
  if (n.length === 2) return `${n[0]}*`;
  return `${n[0]}${'*'.repeat(n.length - 2)}${n[n.length - 1]}`;
};

// 银行卡号校验（Luhn算法）
export const validateBankCard = (cardNo: string): ValidateResult => {
  if (!cardNo || cardNo.trim() === '') {
    return fail('银行卡号不能为空');
  }
  const card = cardNo.trim().replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(card)) {
    return fail('银行卡号格式不正确，应为13-19位数字');
  }
  // Luhn算法
  let sum = 0;
  let isEven = false;
  for (let i = card.length - 1; i >= 0; i--) {
    let digit = parseInt(card[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  if (sum % 10 !== 0) {
    return fail('银行卡号校验未通过，请核实');
  }
  return success;
};

// 银行卡号脱敏（6228 **** **** 1234）
export const maskBankCard = (cardNo: string): string => {
  if (!cardNo) return '';
  const card = cardNo.trim().replace(/\s/g, '');
  if (card.length <= 8) return card;
  return `${card.substring(0, 4)} **** **** ${card.substring(card.length - 4)}`;
};

// 邮箱校验
export const validateEmail = (email: string): ValidateResult => {
  if (!email || email.trim() === '') {
    return fail('邮箱不能为空');
  }
  const e = email.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(e)) {
    return fail('邮箱格式不正确');
  }
  if (e.length > 254) {
    return fail('邮箱长度过长');
  }
  return success;
};

// 邮政编码校验（6位数字）
export const validateZipCode = (code: string): ValidateResult => {
  if (!code || code.trim() === '') {
    return fail('邮政编码不能为空');
  }
  if (!/^\d{6}$/.test(code.trim())) {
    return fail('邮政编码应为6位数字');
  }
  return success;
};

// 姓名校验（中文姓名）
export const validateChineseName = (name: string): ValidateResult => {
  if (!name || name.trim() === '') {
    return fail('姓名不能为空');
  }
  const n = name.trim();
  if (n.length < 2 || n.length > 20) {
    return fail('姓名长度应为2-20个字符');
  }
  // 中文汉字+点号（用于少数民族姓名如：阿沛·阿旺晋美）
  const regex = /^[\u4e00-\u9fa5·•]{2,20}$/;
  if (!regex.test(n)) {
    return fail('姓名只能包含中文汉字和间隔号（·）');
  }
  // 不能以间隔号开头或结尾
  if (/^[·•]|[·•]$/.test(n)) {
    return fail('姓名不能以间隔号开头或结尾');
  }
  return success;
};

// 出生日期校验
export const validateBirthDate = (dateStr: string): ValidateResult => {
  if (!dateStr || dateStr.trim() === '') {
    return fail('出生日期不能为空');
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return fail('出生日期格式不正确');
  }
  const now = new Date();
  if (d > now) {
    return fail('出生日期不能晚于今天');
  }
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 150);
  if (d < minDate) {
    return fail('出生日期不合法，年龄超过150岁');
  }
  return success;
};

// 新生儿出生30天内校验
export const validateNewbornWithin30Days = (birthDate: string): ValidateResult => {
  const baseResult = validateBirthDate(birthDate);
  if (!baseResult.valid) return baseResult;
  const birth = new Date(birthDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
  if (diffDays < 0) {
    return fail('出生日期不能晚于今天');
  }
  if (diffDays > 30) {
    return fail(`新生儿出生已${diffDays}天，超过30天申报期限，需走特批流程`);
  }
  return success;
};

// 地址校验（简单校验：不为空且长度合理）
export const validateAddress = (address: string, minLen = 5, maxLen = 200): ValidateResult => {
  if (!address || address.trim() === '') {
    return fail('地址不能为空');
  }
  const a = address.trim();
  if (a.length < minLen) {
    return fail(`地址长度不足，请填写完整的地址（至少${minLen}个字符）`);
  }
  if (a.length > maxLen) {
    return fail(`地址长度超过限制（最多${maxLen}个字符）`);
  }
  return success;
};

// 必填校验
export const validateRequired = (value: string | undefined | null, fieldName = '该字段'): ValidateResult => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return fail(`${fieldName}不能为空`);
  }
  return success;
};

// 最小长度校验
export const validateMinLength = (value: string, minLen: number, fieldName = '该字段'): ValidateResult => {
  if (value && value.length < minLen) {
    return fail(`${fieldName}长度不能少于${minLen}个字符`);
  }
  return success;
};

// 最大长度校验
export const validateMaxLength = (value: string, maxLen: number, fieldName = '该字段'): ValidateResult => {
  if (value && value.length > maxLen) {
    return fail(`${fieldName}长度不能超过${maxLen}个字符`);
  }
  return success;
};

// 组合校验（按顺序执行，失败即返回）
export const validateAll = (validators: ValidateResult[]): ValidateResult => {
  for (const v of validators) {
    if (!v.valid) return v;
  }
  return success;
};

export default {
  validateIdCard,
  parseIdCard,
  validatePhone,
  maskPhone,
  maskIdCard,
  maskName,
  validateBankCard,
  maskBankCard,
  validateEmail,
  validateZipCode,
  validateChineseName,
  validateBirthDate,
  validateNewbornWithin30Days,
  validateAddress,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateAll,
};
