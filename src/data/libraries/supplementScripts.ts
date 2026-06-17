// 补正话术项
export interface SupplementScript {
  id: string; // 话术ID
  code: string; // 话术编码
  title: string; // 话术标题
  content: string; // 话术内容（模板，支持占位符）
  category: '证件类' | '材料类' | '信息类'; // 话术分类
  subCategory?: string; // 子分类
  relatedSceneIds: string[]; // 关联场景ID
  urgency: 'normal' | 'urgent'; // 紧急程度
  defaultDeadlineDays: number; // 默认补正期限（天）
  enabled: boolean;
}

// 证件类话术
const certScripts: SupplementScript[] = [
  {
    id: 'script-cert-001',
    code: 'CERT_ID_EXPIRED',
    title: '身份证已过有效期',
    content:
      '您好，您提供的【{证件持有人}】居民身份证有效期至{到期日期}，目前已过有效期，无法用于本次业务办理。请携带在有效期内的居民身份证原件前来办理，或先到公安机关换领新证后再申请。如有疑问，请拨打咨询电话12345。',
    category: '证件类',
    subCategory: '身份证',
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-insurance',
      'scene-newborn-allinone',
      'scene-move-in',
      'scene-residence-permit',
    ],
    urgency: 'urgent',
    defaultDeadlineDays: 30,
    enabled: true,
  },
  {
    id: 'script-cert-002',
    code: 'CERT_ID_UNCLEAR',
    title: '身份证复印件不清晰',
    content:
      '您好，您提交的【{证件持有人}】居民身份证复印件图像不清晰，【正反面关键信息区域】无法识别。请重新提供清晰的身份证正反面复印件，确保姓名、证件号码、照片等关键信息完整可辨。建议使用原件复印或600dpi以上扫描件。',
    category: '证件类',
    subCategory: '身份证',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone', 'scene-idcard-replace'],
    urgency: 'normal',
    defaultDeadlineDays: 3,
    enabled: true,
  },
  {
    id: 'script-cert-003',
    code: 'CERT_BIRTH_MISSING',
    title: '缺少出生医学证明',
    content:
      '您好，办理【新生儿出生登记】需提供《出生医学证明》原件及复印件。请您携带新生儿的《出生医学证明》原件前来办理，原件核验后将返还给您，复印件用于存档。如尚未办理出生医学证明，请先到新生儿出生医院申请签发。',
    category: '证件类',
    subCategory: '出生医学证明',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-insurance', 'scene-newborn-allinone'],
    urgency: 'urgent',
    defaultDeadlineDays: 30,
    enabled: true,
  },
  {
    id: 'script-cert-004',
    code: 'CERT_BIRTH_INFO_INCONSISTENT',
    title: '出生医学证明信息不一致',
    content:
      '您好，经核验发现《出生医学证明》上的【{不一致字段}】与您填写的申请信息不一致。出生证上记载为："{出生证信息}"，您填写的是："{填写信息}"。请您确认正确信息，如为填写错误请更正申请表；如为出生证信息有误，请先到签发医院办理出生证信息变更后再申请。',
    category: '证件类',
    subCategory: '出生医学证明',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone'],
    urgency: 'urgent',
    defaultDeadlineDays: 7,
    enabled: true,
  },
  {
    id: 'script-cert-005',
    code: 'CERT_MARRIAGE_MISSING',
    title: '缺少结婚证',
    content:
      '您好，您申请的【新生儿上户口】需要提供父母双方的结婚证。请您携带结婚证原件及复印件前来办理。如确有特殊情况无法提供（如非婚生育），请现场签署《非婚生育情况说明》，我们将按相关政策办理。',
    category: '证件类',
    subCategory: '结婚证',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone', 'scene-move-in'],
    urgency: 'normal',
    defaultDeadlineDays: 7,
    enabled: true,
  },
  {
    id: 'script-cert-006',
    code: 'CERT_HOUSEHOLD_INCOMPLETE',
    title: '户口簿材料不完整',
    content:
      '您好，您提供的居民户口簿材料不完整，缺少【{缺少页码：户主页/本人页/增减页}】。请补充完整户口簿的相关页面复印件，集体户口需提供常住人口登记卡及集体户首页复印件（加盖保管单位公章）。',
    category: '证件类',
    subCategory: '户口簿',
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-allinone',
      'scene-idcard-replace',
      'scene-household-split',
    ],
    urgency: 'normal',
    defaultDeadlineDays: 5,
    enabled: true,
  },
  {
    id: 'script-cert-007',
    code: 'CERT_BANK_CARD_UNREADABLE',
    title: '银行卡复印件无法识别',
    content:
      '您好，您提交的银行卡复印件卡号模糊不清，无法识别准确卡号。请重新提供以下材料之一：1) 清晰的银行卡复印件（确保卡号完整可见）；2) 银行出具的开户证明；3) 网银/手机银行截图（需显示卡号和户名）。银行卡需为新生儿父母一方名下的一类借记卡。',
    category: '证件类',
    subCategory: '银行卡',
    relatedSceneIds: ['scene-newborn-insurance', 'scene-newborn-allinone'],
    urgency: 'normal',
    defaultDeadlineDays: 3,
    enabled: true,
  },
];

// 材料类话术
const materialScripts: SupplementScript[] = [
  {
    id: 'script-mat-001',
    code: 'MAT_HOUSE_PROOF_MISSING',
    title: '缺少合法住所证明',
    content:
      '您好，办理【夫妻投靠落户】需提供合法住所证明材料。请补充以下任一材料：1) 房屋所有权证/不动产权证书复印件；2) 经备案的商品房买卖合同及购房发票；3) 公共租赁住房/廉租房租赁合同；4) 直系亲属的房产证及亲属关系证明。',
    category: '材料类',
    subCategory: '住所证明',
    relatedSceneIds: ['scene-move-in', 'scene-residence-permit', 'scene-household-split'],
    urgency: 'urgent',
    defaultDeadlineDays: 7,
    enabled: true,
  },
  {
    id: 'script-mat-002',
    code: 'MAT_EMPLOYMENT_MISSING',
    title: '缺少就业证明材料',
    content:
      '您好，办理【居住证】需提供就业证明材料。请补充以下任一材料：1) 近6个月社保缴纳证明（可在社保局官网打印）；2) 劳动合同复印件（加盖单位公章）；3) 工商营业执照副本复印件（本人为法定代表人）；4) 单位出具的在职证明。',
    category: '材料类',
    subCategory: '就业证明',
    relatedSceneIds: ['scene-residence-permit'],
    urgency: 'urgent',
    defaultDeadlineDays: 5,
    enabled: true,
  },
  {
    id: 'script-mat-003',
    code: 'MAT_PHOTO_RECEIPT_EXPIRED',
    title: '照片回执已过期',
    content:
      '您好，您提供的居民身份证数字相片采集回执有效期至{到期日期}，目前已超出6个月有效期。请您到照相馆重新拍摄身份证照片并获取新的数字相片采集回执，回执单需加盖照相馆公章。',
    category: '材料类',
    subCategory: '照片回执',
    relatedSceneIds: ['scene-idcard-replace', 'scene-idcard-makeup'],
    urgency: 'normal',
    defaultDeadlineDays: 15,
    enabled: true,
  },
  {
    id: 'script-mat-004',
    code: 'MAT_INSURANCE_CERT_MISSING',
    title: '缺少参保缴费凭证',
    content:
      '您好，办理【社会保险关系转移接续】需提供原参保地社保机构出具的参保缴费凭证。获取方式：1) 登录原参保地社保局官网/APP在线打印；2) 携带身份证到原参保地社保经办窗口打印；3) 通过"掌上12333"APP申请开具电子版。请您补充后再提交。',
    category: '材料类',
    subCategory: '社保证明',
    relatedSceneIds: ['scene-social-security-transfer'],
    urgency: 'urgent',
    defaultDeadlineDays: 15,
    enabled: true,
  },
  {
    id: 'script-mat-005',
    code: 'MAT_SPLIT_AGREEMENT_UNSIGNED',
    title: '分户协议书未签字',
    content:
      '您好，您提交的《分户协议书》未完善签字手续。请确保分户涉及的所有【户内成年成员】均已在协议书上签字并按手印，协议书需明确分户原因、分户后各户户主及成员名单、房产分割情况等内容。如有疑问可现场咨询工作人员获取标准模板。',
    category: '材料类',
    subCategory: '分户材料',
    relatedSceneIds: ['scene-household-split'],
    urgency: 'normal',
    defaultDeadlineDays: 7,
    enabled: true,
  },
  {
    id: 'script-mat-006',
    code: 'MAT_SCAN_QUALITY_POOR',
    title: '扫描件质量不合格',
    content:
      '您好，您提交的【{材料名称}】扫描件存在以下问题：{具体问题：图像模糊/有黑边/角度倾斜/关键信息被遮挡/页码不全}。请重新扫描上传，要求：1) 分辨率不低于300dpi；2) 图像完整无裁切；3) 方向端正；4) 单页大小不超过5MB，格式为PDF或JPG。',
    category: '材料类',
    subCategory: '扫描质量',
    relatedSceneIds: ['scene-newborn-allinone', 'scene-social-security-transfer'],
    urgency: 'normal',
    defaultDeadlineDays: 3,
    enabled: true,
  },
];

// 信息类话术
const infoScripts: SupplementScript[] = [
  {
    id: 'script-info-001',
    code: 'INFO_ADDRESS_INCOMPLETE',
    title: '户籍地址填写不完整',
    content:
      '您好，您填写的户籍地址不够完整，缺少【{缺少部分：省/市/区县/街道/门牌号}】。请按照户口簿上登记的地址完整填写，格式示例：浙江省杭州市西湖区文三路100号1栋2单元301室。完整准确的地址信息是确保业务顺利办理的重要条件。',
    category: '信息类',
    subCategory: '地址信息',
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-allinone',
      'scene-move-in',
      'scene-residence-permit',
    ],
    urgency: 'normal',
    defaultDeadlineDays: 3,
    enabled: true,
  },
  {
    id: 'script-info-002',
    code: 'INFO_NAME_INCONSISTENT',
    title: '姓名信息不一致',
    content:
      '您好，核验发现姓名信息不一致。身份证登记姓名为"{身份证姓名}"，您填写的姓名为"{填写姓名}"。请确认正确姓名并更正。如姓名确实发生过变更，请补充提供户口本（含变更页）或姓名变更证明材料。',
    category: '信息类',
    subCategory: '身份信息',
    relatedSceneIds: ['scene-newborn-register', 'scene-idcard-replace', 'scene-move-in'],
    urgency: 'urgent',
    defaultDeadlineDays: 5,
    enabled: true,
  },
  {
    id: 'script-info-003',
    code: 'INFO_PHONE_FORMAT_ERROR',
    title: '联系电话格式错误',
    content:
      '您好，您填写的联系电话【{填写的号码}】格式不正确。请填写有效的11位中国大陆手机号码，如13812345678。正确的联系电话便于我们及时通知您办理进度，请您核对后更正。',
    category: '信息类',
    subCategory: '联系方式',
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-insurance',
      'scene-newborn-allinone',
      'scene-idcard-replace',
      'scene-residence-permit',
    ],
    urgency: 'normal',
    defaultDeadlineDays: 2,
    enabled: true,
  },
  {
    id: 'script-info-004',
    code: 'INFO_IDCARD_VALIDATE_FAIL',
    title: '身份证号校验不通过',
    content:
      '您好，您填写的【{持证人}】身份证号码【{填写的证件号}】格式校验不通过，请您仔细核对。大陆居民身份证为18位，最后一位可以是0-9或X（大写）。如确有错误请更正后重新提交；如身份证为特殊类型号码，请携带证件原件现场核验。',
    category: '信息类',
    subCategory: '身份信息',
    relatedSceneIds: ['scene-newborn-register', 'scene-idcard-replace', 'scene-move-in'],
    urgency: 'urgent',
    defaultDeadlineDays: 3,
    enabled: true,
  },
  {
    id: 'script-info-005',
    code: 'INFO_NEWBORN_NAME_ILLEGAL',
    title: '新生儿姓名含禁用字符',
    content:
      '您好，您为新生儿申报的姓名"{申报姓名}"中含有不规范字符。根据姓名登记相关规定，姓名应当使用国务院公布的汉字简化字，不得含有：1) 已简化的繁体字；2) 已淘汰的异体字；3) 自造字；4) 外国文字；5) 汉语拼音字母；6) 阿拉伯数字；7) 符号等。请您修改后重新申报。',
    category: '信息类',
    subCategory: '姓名登记',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone'],
    urgency: 'urgent',
    defaultDeadlineDays: 7,
    enabled: true,
  },
  {
    id: 'script-info-006',
    code: 'INFO_ETHNICITY_UNSELECTED',
    title: '民族成份未确认',
    content:
      '您好，请您确认新生儿的民族成份。根据规定，公民民族成份只能登记为国家正式认定的民族名称，父母一方为汉族、一方为少数民族的，可选择登记为汉族或少数民族成份。请您在申请表上明确填写并签字确认。',
    category: '信息类',
    subCategory: '身份信息',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone'],
    urgency: 'normal',
    defaultDeadlineDays: 3,
    enabled: true,
  },
  {
    id: 'script-info-007',
    code: 'INFO_PARENT_INFO_MISSING',
    title: '父母一方信息缺失',
    content:
      '您好，您未填写【{父亲/母亲}】的完整信息。出生登记需登记父母双方基本信息，包括姓名、身份证号、民族等。如确属单亲抚养等特殊情况，请签署《单亲/特殊情况声明》，我们将按政策规定办理。',
    category: '信息类',
    subCategory: '亲属信息',
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-insurance', 'scene-newborn-allinone'],
    urgency: 'urgent',
    defaultDeadlineDays: 5,
    enabled: true,
  },
];

// 汇总导出
export const supplementScriptList: SupplementScript[] = [
  ...certScripts,
  ...materialScripts,
  ...infoScripts,
];

// 话术分类索引
export const supplementCategories = [
  { key: 'all', label: '全部话术', count: supplementScriptList.length },
  { key: '证件类', label: '证件类话术', count: certScripts.length },
  { key: '材料类', label: '材料类话术', count: materialScripts.length },
  { key: '信息类', label: '信息类话术', count: infoScripts.length },
];

// 根据分类获取话术
export const getScriptsByCategory = (category: SupplementScript['category'] | 'all'): SupplementScript[] => {
  if (category === 'all') return supplementScriptList.filter((s) => s.enabled);
  return supplementScriptList.filter((s) => s.category === category && s.enabled);
};

// 根据关联场景获取话术
export const getScriptsByScene = (sceneId: string): SupplementScript[] => {
  return supplementScriptList.filter((s) => s.relatedSceneIds.includes(sceneId) && s.enabled);
};

// 根据ID获取话术
export const getScriptById = (id: string): SupplementScript | undefined => {
  return supplementScriptList.find((s) => s.id === id);
};

// 根据CODE获取话术
export const getScriptByCode = (code: string): SupplementScript | undefined => {
  return supplementScriptList.find((s) => s.code === code);
};

// 话术模板渲染（替换占位符）
export const renderScript = (
  script: SupplementScript,
  vars: Record<string, string>,
): string => {
  let result = script.content;
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  // 未替换的占位符显示为【待补充】
  result = result.replace(/\{[^}]+\}/g, '【待补充】');
  return result;
};

export default supplementScriptList;
