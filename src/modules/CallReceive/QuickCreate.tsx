import { useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Card,
  Row,
  Col,
  Alert,
  message,
} from 'antd';
import {
  Baby,
  User,
  UserRound,
  CreditCard,
  Phone,
  MapPin,
  Send,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useCaseStore } from '@/store/caseStore';
import { useQueueStore } from '@/store/queueStore';
import PersonTypeTabs, { type PersonType } from './PersonTypeTabs';
import { cn } from '@/lib/utils';
import dayjs, { type Dayjs } from 'dayjs';
import {
  validateChineseName,
  validateIdCard,
  validatePhone,
  validateAddress,
  validateRequired,
  validateAll,
} from '@/utils/validator';

interface QuickCreateFormData {
  personType: PersonType;
  babyName: string;
  babyGender: '男' | '女';
  babyBirthDate: Dayjs | null;
  fatherName: string;
  fatherIdCard: string;
  fatherPhone: string;
  fatherAddress: string;
  motherName: string;
  motherIdCard: string;
  motherPhone: string;
  motherAddress: string;
  agentName?: string;
  agentIdCard?: string;
  agentPhone?: string;
}

interface FieldError {
  valid: boolean;
  message: string;
}

interface QuickCreateProps {
  className?: string;
  onSuccess?: (caseNumber: string, queueNumber: string) => void;
}

export default function QuickCreate({ className, onSuccess }: QuickCreateProps) {
  const [form] = Form.useForm<QuickCreateFormData>();
  const [personType, setPersonType] = useState<PersonType>('parents');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, FieldError>>({});
  const [showErrors, setShowErrors] = useState(false);

  const { addCase } = useCaseStore();
  const { addToQueue } = useQueueStore();

  const validateField = (field: keyof QuickCreateFormData, value: any): FieldError => {
    switch (field) {
      case 'babyName':
        return validateAll([
          validateRequired(value, '新生儿姓名'),
          validateChineseName(value),
        ]);
      case 'babyGender':
        return validateRequired(value, '新生儿性别');
      case 'babyBirthDate':
        if (!value) return { valid: false, message: '请选择出生日期' };
        return { valid: true, message: '' };
      case 'fatherName':
        if (personType === 'guardian') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '父亲姓名'),
          validateChineseName(value),
        ]);
      case 'fatherIdCard':
        if (personType === 'guardian') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '父亲身份证号'),
          validateIdCard(value),
        ]);
      case 'fatherPhone':
        if (personType === 'guardian') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '父亲手机号'),
          validatePhone(value),
        ]);
      case 'fatherAddress':
        if (personType === 'guardian') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '父亲户籍地址'),
          validateAddress(value),
        ]);
      case 'motherName':
        if (personType !== 'parents') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '母亲姓名'),
          validateChineseName(value),
        ]);
      case 'motherIdCard':
        if (personType !== 'parents') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '母亲身份证号'),
          validateIdCard(value),
        ]);
      case 'motherPhone':
        if (personType !== 'parents') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '母亲手机号'),
          validatePhone(value),
        ]);
      case 'motherAddress':
        if (personType !== 'parents') return { valid: true, message: '' };
        return validateAll([
          validateRequired(value, '母亲户籍地址'),
          validateAddress(value),
        ]);
      default:
        return { valid: true, message: '' };
    }
  };

  const handleFieldChange = (field: keyof QuickCreateFormData, value: any) => {
    const error = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAllFields = (values: QuickCreateFormData): boolean => {
    const errors: Record<string, FieldError> = {};
    let hasError = false;

    const fieldsToValidate: (keyof QuickCreateFormData)[] = [
      'babyName',
      'babyGender',
      'babyBirthDate',
      'fatherName',
      'fatherIdCard',
      'fatherPhone',
      'fatherAddress',
      'motherName',
      'motherIdCard',
      'motherPhone',
      'motherAddress',
    ];

    for (const field of fieldsToValidate) {
      const error = validateField(field, values[field]);
      errors[field] = error;
      if (!error.valid) hasError = true;
    }

    setFieldErrors(errors);
    setShowErrors(hasError);
    return !hasError;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!validateAllFields(values)) {
        message.error('请检查表单中红色标记的必填项');
        return;
      }

      setSubmitting(true);

      const applicantName =
        personType === 'parents'
          ? `${values.fatherName}/${values.motherName}`
          : values.fatherName;

      const queueItem = addToQueue({
        serviceType: '新生儿出生一件事（全流程联办）',
        applicantName,
        phone: values.fatherPhone,
        priority: false,
      });

      const newCase = addCase({
        babyName: values.babyName,
        birthDate: values.babyBirthDate?.toISOString() || '',
        applicantName,
        phone: values.fatherPhone,
        queueNumber: queueItem.number,
        relation: personType,
        services: ['新生儿出生一件事'],
        materials: [],
        windowNumber: useQueueStore.getState().currentWindow,
      });

      useQueueStore.getState().updateQueueItem(queueItem.id, { caseId: newCase.id });

      setTimeout(() => {
        setSubmitting(false);
        message.success(
          `建单成功！办件编号：${newCase.caseNumber}，排队号码：${queueItem.number}`,
          5,
        );
        onSuccess?.(newCase.caseNumber, queueItem.number);
        handleReset();
      }, 800);
    } catch {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setPersonType('parents');
    setFieldErrors({});
    setShowErrors(false);
  };

  const FieldWrapper = ({
    label,
    icon: Icon,
    required,
    error,
    children,
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required?: boolean;
    error?: FieldError;
    children: React.ReactNode;
  }) => (
    <Form.Item label={label} required={required} className="!mb-3">
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Icon
            className={cn(
              'h-4 w-4',
              error?.valid === false ? 'text-red-400' : 'text-slate-400',
            )}
          />
        </div>
        {children}
        {error?.valid === false && showErrors && (
          <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" />
            <span>{error.message}</span>
          </div>
        )}
      </div>
    </Form.Item>
  );

  return (
    <div className={cn('flex flex-col gap-4 h-full', className)}>
      <PersonTypeTabs value={personType} onChange={setPersonType} />

      {showErrors && (
        <Alert
          type="error"
          showIcon
          icon={<AlertCircle className="h-5 w-5" />}
          message="请检查以下必填项"
          description="带红色标记的字段为必填项，请完整填写后再提交。"
          closable
          onClose={() => setShowErrors(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto pr-1">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
          initialValues={{
            personType: 'parents',
            babyGender: '男',
          }}
        >
          <Card
            className="border-slate-200"
            title={
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100">
                  <Baby className="h-4 w-4 text-pink-600" />
                </div>
                <span className="font-semibold text-slate-800">新生儿信息</span>
              </div>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <FieldWrapper
                  label="新生儿姓名"
                  icon={Baby}
                  required
                  error={fieldErrors.babyName}
                >
                  <Input
                    placeholder="请输入新生儿姓名"
                    className="!pl-10"
                    onChange={(e) => handleFieldChange('babyName', e.target.value)}
                    status={fieldErrors.babyName?.valid === false ? 'error' : ''}
                    size="large"
                  />
                </FieldWrapper>
              </Col>
              <Col span={6}>
                <FieldWrapper
                  label="性别"
                  icon={User}
                  required
                  error={fieldErrors.babyGender}
                >
                  <Radio.Group
                    className="!w-full"
                    onChange={(e) => handleFieldChange('babyGender', e.target.value)}
                  >
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </Radio.Group>
                </FieldWrapper>
              </Col>
              <Col span={6}>
                <FieldWrapper
                  label="出生日期"
                  icon={Baby}
                  required
                  error={fieldErrors.babyBirthDate}
                >
                  <DatePicker
                    className="!w-full !pl-10"
                    format="YYYY-MM-DD"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf('day')
                    }
                    onChange={(date) => handleFieldChange('babyBirthDate', date)}
                    status={fieldErrors.babyBirthDate?.valid === false ? 'error' : ''}
                    size="large"
                  />
                </FieldWrapper>
              </Col>
            </Row>
          </Card>

          {(personType === 'parents' || personType === 'guardian') && (
            <Card
              className="border-slate-200"
              title={
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    {personType === 'guardian' ? '监护人（父亲）信息' : '父亲信息'}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    请如实填写以下信息
                  </span>
                </div>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <FieldWrapper
                    label="姓名"
                    icon={UserRound}
                    required
                    error={fieldErrors.fatherName}
                  >
                    <Input
                      placeholder="请输入姓名"
                      className="!pl-10"
                      onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                      status={fieldErrors.fatherName?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="身份证号"
                    icon={CreditCard}
                    required
                    error={fieldErrors.fatherIdCard}
                  >
                    <Input
                      placeholder="请输入18位身份证号码"
                      className="!pl-10"
                      maxLength={18}
                      onChange={(e) => handleFieldChange('fatherIdCard', e.target.value)}
                      status={fieldErrors.fatherIdCard?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="手机号码"
                    icon={Phone}
                    required
                    error={fieldErrors.fatherPhone}
                  >
                    <Input
                      placeholder="请输入11位手机号码"
                      className="!pl-10"
                      maxLength={11}
                      onChange={(e) => handleFieldChange('fatherPhone', e.target.value)}
                      status={fieldErrors.fatherPhone?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="户籍地址"
                    icon={MapPin}
                    required
                    error={fieldErrors.fatherAddress}
                  >
                    <Input
                      placeholder="请输入详细户籍地址"
                      className="!pl-10"
                      onChange={(e) => handleFieldChange('fatherAddress', e.target.value)}
                      status={fieldErrors.fatherAddress?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
              </Row>
            </Card>
          )}

          {personType === 'parents' && (
            <Card
              className="border-slate-200"
              title={
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
                    <UserRound className="h-4 w-4 text-rose-600" />
                  </div>
                  <span className="font-semibold text-slate-800">母亲信息</span>
                </div>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <FieldWrapper
                    label="姓名"
                    icon={UserRound}
                    required
                    error={fieldErrors.motherName}
                  >
                    <Input
                      placeholder="请输入姓名"
                      className="!pl-10"
                      onChange={(e) => handleFieldChange('motherName', e.target.value)}
                      status={fieldErrors.motherName?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="身份证号"
                    icon={CreditCard}
                    required
                    error={fieldErrors.motherIdCard}
                  >
                    <Input
                      placeholder="请输入18位身份证号码"
                      className="!pl-10"
                      maxLength={18}
                      onChange={(e) => handleFieldChange('motherIdCard', e.target.value)}
                      status={fieldErrors.motherIdCard?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="手机号码"
                    icon={Phone}
                    required
                    error={fieldErrors.motherPhone}
                  >
                    <Input
                      placeholder="请输入11位手机号码"
                      className="!pl-10"
                      maxLength={11}
                      onChange={(e) => handleFieldChange('motherPhone', e.target.value)}
                      status={fieldErrors.motherPhone?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper
                    label="户籍地址"
                    icon={MapPin}
                    required
                    error={fieldErrors.motherAddress}
                  >
                    <Input
                      placeholder="请输入详细户籍地址"
                      className="!pl-10"
                      onChange={(e) => handleFieldChange('motherAddress', e.target.value)}
                      status={fieldErrors.motherAddress?.valid === false ? 'error' : ''}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
              </Row>
            </Card>
          )}

          {personType === 'agent' && (
            <Card
              className="border-slate-200"
              title={
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="font-semibold text-slate-800">委托代理人信息</span>
                </div>
              }
            >
              <Alert
                type="info"
                showIcon
                message="委托代理需提供授权委托书"
                description="代理人除提供自身身份证明外，还需提交经公证的授权委托书原件。"
                className="!mb-4"
              />
              <Row gutter={16}>
                <Col span={12}>
                  <FieldWrapper label="代理人姓名" icon={UserRound}>
                    <Input placeholder="请输入代理人姓名" className="!pl-10" size="large" />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper label="代理人身份证号" icon={CreditCard}>
                    <Input
                      placeholder="请输入18位身份证号码"
                      className="!pl-10"
                      maxLength={18}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
                <Col span={12}>
                  <FieldWrapper label="联系电话" icon={Phone}>
                    <Input
                      placeholder="请输入11位手机号码"
                      className="!pl-10"
                      maxLength={11}
                      size="large"
                    />
                  </FieldWrapper>
                </Col>
              </Row>
            </Card>
          )}
        </Form>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
        <div className="text-sm text-slate-500">
          带 <span className="text-red-500">*</span> 为必填项，请仔细核对信息后提交
        </div>
        <div className="flex items-center gap-3">
          <Button
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={handleReset}
            disabled={submitting}
            className="!h-10 !px-5"
          >
            重置表单
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<Send className="h-4 w-4" />}
            onClick={handleSubmit}
            loading={submitting}
            className="!h-10 !px-6 !text-base font-semibold"
          >
            提交建单
          </Button>
        </div>
      </div>
    </div>
  );
}
