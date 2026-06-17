import type { MaterialItem } from '../../types';

// 材料清单库（全量材料定义）
export interface MaterialDef {
  id: string; // 材料ID
  name: string; // 材料名称
  category: '证件类' | '证明类' | '表单类' | '其他'; // 材料分类
  requiredDefault: boolean; // 默认是否必收
  desc?: string; // 材料说明
  format?: string; // 格式要求
  copies?: number; // 份数要求
  relatedSceneIds: string[]; // 关联场景ID
  canShare?: boolean; // 是否可复用共享
  canVerifyOnline?: boolean; // 是否可在线核验
  sampleImage?: string; // 样例图片
  tips?: string[]; // 提交注意事项
}

export const materialDefLibrary: MaterialDef[] = [
  {
    id: 'mat-birth-cert',
    name: '出生医学证明',
    category: '证件类',
    requiredDefault: true,
    desc: '新生儿出生医院签发的《出生医学证明》原件及复印件',
    format: '原件1份 + 复印件1份',
    copies: 2,
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-insurance',
      'scene-newborn-vaccine',
      'scene-newborn-allinone',
    ],
    canShare: true,
    canVerifyOnline: true,
    tips: ['请核对新生儿姓名、性别、出生日期等信息', '复印件需清晰完整'],
  },
  {
    id: 'mat-parent-id',
    name: '父母双方居民身份证',
    category: '证件类',
    requiredDefault: true,
    desc: '父亲和母亲的居民身份证原件及正反面复印件',
    format: '原件各1份 + 复印件各1份',
    copies: 4,
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-insurance',
      'scene-newborn-vaccine',
      'scene-newborn-allinone',
    ],
    canShare: true,
    canVerifyOnline: true,
    tips: ['身份证需在有效期内', '正反面均需复印'],
  },
  {
    id: 'mat-marriage-cert',
    name: '结婚证',
    category: '证件类',
    requiredDefault: true,
    desc: '父母双方的结婚证原件及复印件',
    format: '原件1份 + 复印件1份',
    copies: 2,
    relatedSceneIds: ['scene-newborn-register', 'scene-newborn-allinone', 'scene-move-in'],
    canShare: true,
    canVerifyOnline: true,
    tips: ['非婚生育可免交，需额外提供非婚生育说明'],
  },
  {
    id: 'mat-household',
    name: '居民户口簿',
    category: '证件类',
    requiredDefault: true,
    desc: '父母双方或落户方的居民户口簿原件及复印件',
    format: '原件1份 + 复印件1份（首页、本人页、户主页）',
    copies: 2,
    relatedSceneIds: [
      'scene-newborn-register',
      'scene-newborn-insurance',
      'scene-newborn-allinone',
      'scene-idcard-replace',
      'scene-idcard-makeup',
      'scene-household-split',
      'scene-move-in',
    ],
    canShare: true,
    canVerifyOnline: true,
    tips: ['集体户口需提供常住人口登记卡'],
  },
  {
    id: 'mat-bank-card',
    name: '父母一方银行卡',
    category: '证件类',
    requiredDefault: true,
    desc: '用于新生儿医保扣费的银行卡复印件',
    format: '复印件1份（需清晰显示卡号和户名）',
    copies: 1,
    relatedSceneIds: ['scene-newborn-insurance', 'scene-newborn-allinone'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['建议使用一类借记卡', '需与参保人存在亲属关系'],
  },
  {
    id: 'mat-hospital-discharge',
    name: '医院出院小结/分娩记录',
    category: '证明类',
    requiredDefault: false,
    desc: '产妇分娩医院出具的出院小结或分娩记录',
    format: '复印件1份',
    copies: 1,
    relatedSceneIds: ['scene-newborn-vaccine', 'scene-newborn-allinone'],
    canShare: true,
    canVerifyOnline: false,
    tips: ['部分社区卫生服务中心需要此材料建档'],
  },
  {
    id: 'mat-applicant-id',
    name: '申请人居民身份证',
    category: '证件类',
    requiredDefault: true,
    desc: '申请人本人的居民身份证原件及正反面复印件',
    format: '原件1份 + 复印件1份',
    copies: 2,
    relatedSceneIds: ['scene-move-in', 'scene-social-security-transfer'],
    canShare: true,
    canVerifyOnline: true,
    tips: ['身份证需在有效期内'],
  },
  {
    id: 'mat-house-proof',
    name: '合法住所证明',
    category: '证明类',
    requiredDefault: true,
    desc: '房屋产权证、购房合同、房屋租赁合同等住所证明材料',
    format: '原件1份 + 复印件1份',
    copies: 2,
    relatedSceneIds: ['scene-move-in', 'scene-residence-permit', 'scene-household-split'],
    canShare: false,
    canVerifyOnline: true,
    tips: ['需是申请人或直系亲属名下的房产'],
  },
  {
    id: 'mat-old-idcard',
    name: '原居民身份证',
    category: '证件类',
    requiredDefault: true,
    desc: '有效期满或登记项目变更的原居民身份证',
    format: '原件1份',
    copies: 1,
    relatedSceneIds: ['scene-idcard-replace'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['换领完成后原证将被回收销毁'],
  },
  {
    id: 'mat-photo-receipt',
    name: '身份证照片回执',
    category: '证明类',
    requiredDefault: true,
    desc: '照相馆出具的居民身份证数字相片采集回执',
    format: '回执单1份',
    copies: 1,
    relatedSceneIds: ['scene-idcard-replace', 'scene-idcard-makeup'],
    canShare: false,
    canVerifyOnline: true,
    tips: ['回执有效期为6个月', '照片需为近6个月内拍摄'],
  },
  {
    id: 'mat-loss-report',
    name: '身份证挂失申报单',
    category: '表单类',
    requiredDefault: true,
    desc: '居民身份证丢失后的挂失申报凭证',
    format: '原件1份',
    copies: 1,
    relatedSceneIds: ['scene-idcard-makeup'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['可在现场填写挂失申报单'],
  },
  {
    id: 'mat-idcard',
    name: '本人居民身份证',
    category: '证件类',
    requiredDefault: true,
    desc: '申请人本人居民身份证原件及复印件',
    format: '原件1份 + 复印件1份',
    copies: 2,
    relatedSceneIds: ['scene-residence-permit', 'scene-social-security-transfer', 'scene-household-split'],
    canShare: true,
    canVerifyOnline: true,
    tips: ['身份证需在有效期内'],
  },
  {
    id: 'mat-employment-proof',
    name: '就业证明材料',
    category: '证明类',
    requiredDefault: true,
    desc: '劳动合同、社保缴纳证明、工商营业执照等就业证明',
    format: '原件或复印件1份',
    copies: 1,
    relatedSceneIds: ['scene-residence-permit'],
    canShare: false,
    canVerifyOnline: true,
    tips: ['社保缴纳证明需近6个月连续缴纳记录'],
  },
  {
    id: 'mat-photo',
    name: '近期免冠照片',
    category: '证明类',
    requiredDefault: true,
    desc: '近期一寸免冠彩色照片',
    format: '白底彩色照片2张',
    copies: 2,
    relatedSceneIds: ['scene-residence-permit'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['尺寸为35mm×45mm', '不着制式服装，不戴首饰'],
  },
  {
    id: 'mat-insurance-cert',
    name: '参保缴费凭证',
    category: '证明类',
    requiredDefault: true,
    desc: '原参保地社保机构出具的基本养老保险/医疗保险参保缴费凭证',
    format: '原件1份',
    copies: 1,
    relatedSceneIds: ['scene-social-security-transfer'],
    canShare: false,
    canVerifyOnline: true,
    tips: ['可通过原参保地网上服务平台打印'],
  },
  {
    id: 'mat-termination-proof',
    name: '解除劳动关系证明',
    category: '证明类',
    requiredDefault: false,
    desc: '与原单位解除劳动关系的证明材料',
    format: '复印件1份',
    copies: 1,
    relatedSceneIds: ['scene-social-security-transfer'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['灵活就业人员无需提供'],
  },
  {
    id: 'mat-transfer-form',
    name: '社保关系转移接续申请表',
    category: '表单类',
    requiredDefault: true,
    desc: '《基本养老保险关系转移接续申请表》/《基本医疗保险关系转移接续申请表》',
    format: '原件1份（需本人签字）',
    copies: 1,
    relatedSceneIds: ['scene-social-security-transfer'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['可现场领取填写，也可网上下载打印'],
  },
  {
    id: 'mat-split-agreement',
    name: '分户协议书',
    category: '表单类',
    requiredDefault: true,
    desc: '户内成员签字确认的分户协议书',
    format: '原件1份（所有相关人员签字）',
    copies: 1,
    relatedSceneIds: ['scene-household-split'],
    canShare: false,
    canVerifyOnline: false,
    tips: ['需明确分户后各户户主和成员'],
  },
];

// 新生儿出生一件事（全流程联办）的材料清单（带状态）
export const allInOneMaterials: MaterialItem[] = [
  {
    id: 'mat-birth-cert-001',
    name: '出生医学证明',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-parent-id-001',
    name: '父母双方居民身份证',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 4,
  },
  {
    id: 'mat-marriage-cert-001',
    name: '结婚证',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-household-001',
    name: '居民户口簿',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-bank-card-001',
    name: '父母一方银行卡',
    required: true,
    category: '证件类',
    status: '已提交',
    uploadCount: 1,
    remark: '待OCR识别核验',
  },
  {
    id: 'mat-hospital-discharge-001',
    name: '医院出院小结/分娩记录',
    required: false,
    category: '证明类',
    status: '未提交',
    uploadCount: 0,
    remark: '用于预防接种档案建档，建议提供',
  },
];

// 新生儿上户口场景的材料清单（带状态）
export const newbornRegisterMaterials: MaterialItem[] = [
  {
    id: 'mat-birth-cert-002',
    name: '出生医学证明',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-parent-id-002',
    name: '父母双方居民身份证',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 4,
  },
  {
    id: 'mat-marriage-cert-002',
    name: '结婚证',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-household-002',
    name: '居民户口簿',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
];

// 新生儿医保社保联办的材料清单（带补正状态）
export const insuranceMaterials: MaterialItem[] = [
  {
    id: 'mat-birth-cert-003',
    name: '出生医学证明',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-household-003',
    name: '居民户口簿',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 2,
  },
  {
    id: 'mat-parent-id-003',
    name: '父母双方居民身份证',
    required: true,
    category: '证件类',
    status: '已核验',
    uploadCount: 4,
  },
  {
    id: 'mat-bank-card-003',
    name: '父母一方银行卡',
    required: true,
    category: '证件类',
    status: '需补正',
    uploadCount: 1,
    supplementReason: '银行卡复印件不清晰，卡号无法识别',
  },
];

// 根据场景ID获取默认材料清单
export const getDefaultMaterialsByScene = (sceneId: string): MaterialItem[] => {
  const relatedDefs = materialDefLibrary.filter((d) => d.relatedSceneIds.includes(sceneId));
  return relatedDefs.map((def, index) => ({
    id: `${def.id}-${String(index + 1).padStart(3, '0')}`,
    name: def.name,
    required: def.requiredDefault,
    category: def.category,
    status: '未提交' as const,
    uploadCount: 0,
  }));
};

// 获取材料定义
export const getMaterialDef = (id: string): MaterialDef | undefined => {
  return materialDefLibrary.find((m) => m.id === id);
};

// 获取分类下拉
export const materialCategoryList = [
  { label: '全部', value: 'all' },
  { label: '证件类', value: '证件类' },
  { label: '证明类', value: '证明类' },
  { label: '表单类', value: '表单类' },
  { label: '其他', value: '其他' },
];

export default materialDefLibrary;
