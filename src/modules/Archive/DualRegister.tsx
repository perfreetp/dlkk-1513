import { Card, Tabs, Form, Input, DatePicker, Button, message } from 'antd';
import {
  BookOpen,
  Database,
  Folder,
  MapPin,
  User,
  CalendarDays,
  HardDrive,
  FolderOpen,
  Save,
} from 'lucide-react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useArchiveStore, type RegisterType } from '@/store/archiveStore';

const { RangePicker } = DatePicker;

export default function DualRegister() {
  const [paperForm] = Form.useForm();
  const [electronicForm] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const {
    registerType,
    setRegisterType,
    paperForm: paperData,
    electronicForm: electronicData,
    setPaperForm,
    setElectronicForm,
  } = useArchiveStore();

  const handleTabChange = (key: string) => {
    setRegisterType(key as RegisterType);
  };

  const handleSavePaper = async () => {
    try {
      const values = await paperForm.validateFields();
      setSaving(true);
      await new Promise((r) => setTimeout(r, 600));
      setPaperForm({
        ...values,
        bindDate: values.bindDate ? values.bindDate.format('YYYY-MM-DD') : '',
      });
      setSaving(false);
      message.success('纸质登记信息保存成功');
    } catch (e) {
      setSaving(false);
    }
  };

  const handleSaveElectronic = async () => {
    try {
      const values = await electronicForm.validateFields();
      setSaving(true);
      await new Promise((r) => setTimeout(r, 600));
      setElectronicForm({
        ...values,
        archiveDate: values.archiveDate
          ? values.archiveDate.format('YYYY-MM-DD')
          : '',
      });
      setSaving(false);
      message.success('电子登记信息保存成功');
    } catch (e) {
      setSaving(false);
    }
  };

  const paperTab = (
    <div className="flex items-center gap-2">
      <BookOpen size={16} />
      纸质登记
    </div>
  );

  const electronicTab = (
    <div className="flex items-center gap-2">
      <Database size={16} />
      电子登记
    </div>
  );

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Folder size={18} className="text-primary-600" />
            双登记管理
          </span>
        </div>
      }
      className="h-full"
    >
      <Tabs
        activeKey={registerType}
        onChange={handleTabChange}
        size="large"
        className="[&_.ant-tabs-nav]:!mb-4"
        items={[
          {
            key: 'paper',
            label: paperTab,
            children: (
              <div className="px-2 py-2">
                <Form
                  form={paperForm}
                  layout="vertical"
                  initialValues={{
                    boxNo: paperData.boxNo,
                    location: paperData.location,
                    binder: paperData.binder,
                    bindDate: paperData.bindDate ? dayjs(paperData.bindDate) : undefined,
                  }}
                  onValuesChange={(changed) => setPaperForm(changed)}
                >
                  <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <Folder size={13} className="text-slate-400" />
                          档案盒号
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="boxNo"
                      rules={[
                        { required: true, message: '请输入档案盒号' },
                      ]}
                    >
                      <Input
                        placeholder="例：DA-2026-A-0123"
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400" />
                          存放位置
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="location"
                      rules={[
                        { required: true, message: '请输入存放位置' },
                      ]}
                    >
                      <Input
                        placeholder="例：3号档案柜 - 第2层 - B区"
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          装订人
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="binder"
                      rules={[
                        { required: true, message: '请输入装订人姓名' },
                      ]}
                    >
                      <Input
                        placeholder="请输入装订人姓名"
                        allowClear
                        prefix={<span className="text-slate-400">👤</span>}
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-slate-400" />
                          装订日期
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="bindDate"
                      rules={[
                        { required: true, message: '请选择装订日期' },
                      ]}
                    >
                      <DatePicker
                        className="!w-full"
                        placeholder="请选择装订日期"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </div>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                      <BookOpen size={15} className="text-amber-600" />
                      纸质归档要求
                    </div>
                    <ul className="space-y-1.5 pl-1 text-xs leading-relaxed text-amber-700/90">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        所有纸质材料需使用A4规格纸张，按目录顺序排列
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        装订方式采用左侧装订，确保不掉页、不松动
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        档案盒标签需清晰标注档案盒号、办件编号、起止日期
                      </li>
                    </ul>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      type="primary"
                      icon={<Save size={14} />}
                      loading={saving}
                      onClick={handleSavePaper}
                      className="bg-gradient-to-r from-amber-600 to-orange-600"
                    >
                      保存纸质登记
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
          {
            key: 'electronic',
            label: electronicTab,
            children: (
              <div className="px-2 py-2">
                <Form
                  form={electronicForm}
                  layout="vertical"
                  initialValues={{
                    eArchiveNo: electronicData.eArchiveNo,
                    storagePath: electronicData.storagePath,
                    archivist: electronicData.archivist,
                    archiveDate: electronicData.archiveDate
                      ? dayjs(electronicData.archiveDate)
                      : undefined,
                  }}
                  onValuesChange={(changed) => setElectronicForm(changed)}
                >
                  <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <HardDrive size={13} className="text-slate-400" />
                          电子档号
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="eArchiveNo"
                      rules={[
                        { required: true, message: '请输入电子档号' },
                      ]}
                    >
                      <Input
                        placeholder="例：EL-2026-06-01234"
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <FolderOpen size={13} className="text-slate-400" />
                          存储路径
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="storagePath"
                      rules={[
                        { required: true, message: '请输入存储路径' },
                      ]}
                    >
                      <Input
                        placeholder="例：/archive/2026/06/CS202606101234"
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          归档人
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="archivist"
                      rules={[
                        { required: true, message: '请输入归档人姓名' },
                      ]}
                    >
                      <Input
                        placeholder="请输入归档人姓名"
                        allowClear
                        prefix={<span className="text-slate-400">👤</span>}
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} className="text-slate-400" />
                          归档日期
                          <span className="text-rose-500">*</span>
                        </span>
                      }
                      name="archiveDate"
                      rules={[
                        { required: true, message: '请选择归档日期' },
                      ]}
                    >
                      <DatePicker
                        className="!w-full"
                        placeholder="请选择归档日期"
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                  </div>

                  <div className="mt-2 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-800">
                      <Database size={15} className="text-blue-600" />
                      电子归档要求
                    </div>
                    <ul className="space-y-1.5 pl-1 text-xs leading-relaxed text-blue-700/90">
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        扫描分辨率不低于300DPI，采用PDF格式归档
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        文件命名规范：办件编号_材料名称_页码.pdf
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        完成归档后自动同步至电子档案管理系统并生成备份
                      </li>
                    </ul>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      type="primary"
                      icon={<Save size={14} />}
                      loading={saving}
                      onClick={handleSaveElectronic}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      保存电子登记
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
