import { useState } from 'react';
import {
  Card,
  Tag,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Switch,
  QRCode,
  Empty,
  Space,
  Modal,
  Descriptions,
  Typography,
} from 'antd';
const { Text } = Typography;
import {
  CreditCard,
  QrCode,
  Building2,
  CalendarClock,
  Link as LinkIcon,
  Unlink,
  Eye,
  FileCheck2,
  ShieldCheck,
  ShieldOff,
  Info,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArchiveStore, type ELicense } from '@/store/archiveStore';

const licenseTypeColorMap: Record<string, string> = {
  出生医学证明: 'from-rose-500 to-pink-500',
  户口本页: 'from-blue-500 to-indigo-500',
  社保卡: 'from-emerald-500 to-teal-500',
  医保凭证: 'from-amber-500 to-orange-500',
};

const licenseTypeBgMap: Record<string, string> = {
  出生医学证明: 'bg-rose-50 border-rose-200',
  户口本页: 'bg-blue-50 border-blue-200',
  社保卡: 'bg-emerald-50 border-emerald-200',
  医保凭证: 'bg-amber-50 border-amber-200',
};

export default function ELicenseBind() {
  const { licenses, toggleLicenseBind, caseNumber } = useArchiveStore();
  const [previewLicense, setPreviewLicense] = useState<ELicense | null>(null);
  const [bindingId, setBindingId] = useState<string | null>(null);

  const boundCount = licenses.filter((l) => l.bound).length;
  const totalCount = licenses.length;

  const handleToggleBind = async (license: ELicense) => {
    setBindingId(license.id);
    await new Promise((r) => setTimeout(r, 500));
    toggleLicenseBind(license.id);
    setBindingId(null);
    message.success(
      license.bound
        ? `已解绑「${license.type}」`
        : `已成功绑定「${license.type}」`,
    );
  };

  const handlePreview = (license: ELicense) => {
    setPreviewLicense(license);
  };

  return (
    <>
      <Card
        title={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <CreditCard size={18} className="text-primary-600" />
              电子证照绑定
            </span>
            <Space size={10} wrap>
              <Tag color="green" className="m-0">
                <ShieldCheck size={12} className="mr-1" />
                已绑定 {boundCount}/{totalCount}
              </Tag>
              <Tag color="blue" className="m-0">
                关联办件：{caseNumber}
              </Tag>
            </Space>
          </div>
        }
        className="h-full"
      >
        <div className="mb-4 flex items-center justify-between rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50/80 to-blue-50/60 px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <Info size={16} className="text-primary-600" />
            <span>
              系统已自动匹配以下可绑定电子证照，点击右侧开关进行绑定/解绑操作
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs md:flex">
            <span className="flex items-center gap-1 text-slate-500">
              <LinkIcon size={12} /> 绑定
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Unlink size={12} /> 解绑
            </span>
          </div>
        </div>

        {licenses.length === 0 ? (
          <Empty
            description="暂无可绑定的电子证照"
            className="py-12"
          />
        ) : (
          <div className="space-y-3">
            {licenses.map((license: ELicense) => {
              const gradientClass =
                licenseTypeColorMap[license.type] ||
                'from-slate-500 to-slate-600';
              const bgClass =
                licenseTypeBgMap[license.type] ||
                'bg-slate-50 border-slate-200';

              return (
                <div
                  key={license.id}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border-2 transition-all duration-300',
                    license.bound
                      ? bgClass
                      : 'border-slate-200 bg-white opacity-80 hover:opacity-100',
                  )}
                >
                  {license.bound && (
                    <div
                      className={cn(
                        'absolute left-0 top-0 h-full w-1 bg-gradient-to-b',
                        gradientClass,
                      )}
                    />
                  )}

                  <div className="flex gap-4 p-4 pl-5">
                    <div
                      className={cn(
                        'relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1 shadow-sm',
                        license.bound ? '' : 'opacity-60 grayscale',
                      )}
                    >
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-10',
                          gradientClass,
                        )}
                      />
                      <img
                        src={license.qrCode}
                        alt={`${license.type} 二维码`}
                        className="relative h-full w-full rounded-lg object-cover"
                      />
                      {license.bound && (
                        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                          <ShieldCheck size={14} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4
                            className={cn(
                              'text-base font-bold',
                              license.bound ? 'text-slate-800' : 'text-slate-500',
                            )}
                          >
                            {license.type}
                          </h4>
                          {license.bound ? (
                            <Tag
                              color="success"
                              className="m-0"
                              icon={<FileCheck2 size={11} />}
                            >
                              已绑定
                            </Tag>
                          ) : (
                            <Tag
                              className="m-0 border-slate-200 bg-slate-100 text-slate-500"
                              icon={<ShieldOff size={11} />}
                            >
                              未绑定
                            </Tag>
                          )}
                        </div>

                        <Space size={6}>
                          <Tooltip title="查看详情">
                            <Button
                              type="text"
                              size="small"
                              icon={<Eye size={14} />}
                              onClick={() => handlePreview(license)}
                            >
                              详情
                            </Button>
                          </Tooltip>

                          <Popconfirm
                            title={
                              license.bound
                                ? `确定解绑「${license.type}」？`
                                : `确定绑定「${license.type}」？`
                            }
                            description={
                              license.bound
                                ? '解绑后办件关联的该证照信息将被移除'
                                : '绑定后电子证照将与本办件永久关联'
                            }
                            okText="确定"
                            cancelText="取消"
                            okButtonProps={
                              license.bound ? { danger: true } : { type: 'primary' }
                            }
                            onConfirm={() => handleToggleBind(license)}
                          >
                            <div className="flex items-center gap-1.5">
                              <Switch
                                checked={license.bound}
                                loading={bindingId === license.id}
                              />
                            </div>
                          </Popconfirm>
                        </Space>
                      </div>

                      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1">
                          <QrCode
                            size={12}
                            className={cn(
                              license.bound ? 'text-primary-600' : 'text-slate-400',
                            )}
                          />
                          <span className="text-slate-500">证照编号：</span>
                          <Text
                            copyable={{ text: license.licenseNo }}
                            className={cn(
                              '!mb-0 font-mono font-medium !bg-transparent',
                              license.bound ? 'text-slate-700' : 'text-slate-500',
                            )}
                          >
                            {license.licenseNo}
                          </Text>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Building2 size={12} className="shrink-0 text-slate-400" />
                          <span className="truncate">
                            签发：
                            <span
                              className={cn(
                                'ml-0.5',
                                license.bound
                                  ? 'font-medium text-slate-700'
                                  : '',
                              )}
                            >
                              {license.issuer}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <CalendarClock
                            size={12}
                            className="shrink-0 text-slate-400"
                          />
                          <span className="truncate">
                            有效期：
                            <span
                              className={cn(
                                'ml-0.5',
                                license.bound
                                  ? 'font-medium text-slate-700'
                                  : '',
                              )}
                            >
                              {license.validFrom} ~ {license.validTo}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {boundCount === totalCount && totalCount > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 text-sm text-emerald-800">
            <ShieldCheck size={18} className="text-emerald-600" />
            <span className="font-semibold">全部证照已完成绑定</span>
            <span className="text-emerald-700/80">
              ，可进入后续归档流程
            </span>
          </div>
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-primary-600" />
            证照详情 - {previewLicense?.type}
          </div>
        }
        open={!!previewLicense}
        onCancel={() => setPreviewLicense(null)}
        width={560}
        footer={[
          <Button key="close" onClick={() => setPreviewLicense(null)}>
            关闭
          </Button>,
          previewLicense && (
            <Button
              key="toggle-bind"
              type={previewLicense.bound ? 'default' : 'primary'}
              danger={previewLicense.bound}
              icon={previewLicense.bound ? <Unlink size={14} /> : <LinkIcon size={14} />}
              onClick={() => {
                handleToggleBind(previewLicense);
              }}
            >
              {previewLicense.bound ? '解除绑定' : '立即绑定'}
            </Button>
          ),
        ]}
      >
        {previewLicense && (
          <div className="space-y-5">
            <div className="flex items-start gap-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <QRCode
                  value={previewLicense.licenseNo}
                  size={104}
                  level="M"
                  color={previewLicense.bound ? '#1E40AF' : '#94a3b8'}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-2 text-xl font-bold text-slate-800">
                  {previewLicense.type}
                </h3>
                <div className="mb-3">
                  {previewLicense.bound ? (
                    <Tag color="success" icon={<ShieldCheck size={12} />}>
                      已绑定至办件
                    </Tag>
                  ) : (
                    <Tag
                      className="border-slate-200 bg-slate-100 text-slate-500"
                      icon={<ShieldOff size={12} />}
                    >
                      未绑定
                    </Tag>
                  )}
                </div>
                <Text
                  copyable={{ text: previewLicense.licenseNo }}
                  className="!mb-0 block !rounded-lg !border !border-dashed !border-primary-200 !bg-primary-50/50 !px-3 !py-2 text-sm font-mono !text-primary-700"
                >
                  {previewLicense.licenseNo}
                </Text>
              </div>
            </div>

            <Descriptions
              column={1}
              bordered
              size="middle"
              labelStyle={{
                width: 110,
                backgroundColor: '#f8fafc',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              <Descriptions.Item label="证照类型">
                <Tag color="blue">{previewLicense.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="证照编号">
                {previewLicense.licenseNo}
              </Descriptions.Item>
              <Descriptions.Item label="签发机关">
                {previewLicense.issuer}
              </Descriptions.Item>
              <Descriptions.Item label="生效日期">
                {previewLicense.validFrom}
              </Descriptions.Item>
              <Descriptions.Item label="有效期至">
                {previewLicense.validTo === '长期有效' ? (
                  <Tag color="green">长期有效</Tag>
                ) : (
                  previewLicense.validTo
                )}
              </Descriptions.Item>
              <Descriptions.Item label="关联办件">
                <span className="font-mono text-primary-700">{caseNumber}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </>
  );
}
