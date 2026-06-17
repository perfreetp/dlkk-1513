import ScriptLibrary from './ScriptLibrary';
import SupplementList from './SupplementList';
import NoticeGenerator from './NoticeGenerator';
import { useSupplementStore } from '@/store/supplementStore';
import {
  FileX2,
  BookOpen,
  ListChecks,
  FileWarning,
  User,
  Phone,
  AlertTriangle,
  Send,
  Save,
  ChevronRight,
} from 'lucide-react';
import { Button, Tag, Divider, Steps, message, Card, Avatar, Space } from 'antd';
import { useState } from 'react';

const stepList = [
  { title: '选择话术', icon: <BookOpen className="w-5 h-5" /> },
  { title: '编辑清单', icon: <ListChecks className="w-5 h-5" /> },
  { title: '确认通知', icon: <FileWarning className="w-5 h-5" /> },
];

export default function SupplementModule() {
  const { supplementList, noticeContent, generateNoticeFromList, printNotice } = useSupplementStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [sending, setSending] = useState(false);

  const highCount = supplementList.filter((i) => i.priority === '高').length;
  const midCount = supplementList.filter((i) => i.priority === '中').length;
  const lowCount = supplementList.filter((i) => i.priority === '低').length;

  const handleSendNotice = () => {
    if (supplementList.length === 0) {
      message.warning('请先添加补正材料项');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      message.success('补正通知书已成功发送！短信和邮件通知已同步推送');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
              <FileX2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">材料补正处置</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                根据审核结果选择标准化话术，生成并发送补正通知书
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Space size={8}>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                <Avatar
                  size={28}
                  icon={<User className="w-4 h-4 text-slate-500" />}
                  className="!bg-white !border !border-slate-200"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-700">{noticeContent.applicantName}</div>
                  <div className="text-slate-400 font-mono flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    {noticeContent.applicantPhone}
                  </div>
                </div>
              </div>
              <Tag color="orange" className="!rounded-full !px-3 !text-xs font-medium">
                办件编号：{noticeContent.caseNo}
              </Tag>
            </Space>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <Steps
            current={currentStep}
            onChange={setCurrentStep}
            size="small"
            items={stepList.map((s) => ({
              title: s.title,
              icon: s.icon,
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <BookOpen className="w-4 h-4 text-[#1E40AF]" />
                第一步：选择补正话术
              </div>
              <Tag color="blue" className="!rounded-full !m-0">
                话术一键插入清单
              </Tag>
            </div>
            <div className="gov-card-body bg-slate-50/30">
              <ScriptLibrary />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <ListChecks className="w-4 h-4 text-[#1E40AF]" />
                第二步：编辑补正清单
              </div>
              <div className="flex items-center gap-2 text-xs">
                {highCount > 0 && (
                  <Tag color="red" className="!m-0">
                    <AlertTriangle className="w-3 h-3 inline mr-0.5" />
                    高优 {highCount}
                  </Tag>
                )}
                {midCount > 0 && (
                  <Tag color="warning" className="!m-0">
                    中优 {midCount}
                  </Tag>
                )}
                {lowCount > 0 && (
                  <Tag color="green" className="!m-0">
                    低优 {lowCount}
                  </Tag>
                )}
              </div>
            </div>
            <div className="gov-card-body">
              <SupplementList />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <FileWarning className="w-4 h-4 text-[#1E40AF]" />
                第三步：补正通知书预览
              </div>
              <Button
                size="small"
                onClick={generateNoticeFromList}
                className="!rounded-lg"
              >
                自动生成内容
              </Button>
            </div>
            <div className="gov-card-body bg-slate-50/50 overflow-x-auto">
              <NoticeGenerator />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-body flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                  补正项 <span className="font-semibold text-slate-700">{supplementList.length}</span> 项
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>
                  高优先 <span className="font-semibold text-red-600">{highCount}</span>
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>
                  受理窗口：<span className="font-semibold text-slate-700">{noticeContent.issueOffice}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="large"
                  icon={<Save className="w-4 h-4" />}
                  className="!rounded-lg !h-11 !px-6"
                  onClick={() => message.success('补正记录已保存为草稿')}
                >
                  保存草稿
                </Button>
                <Button
                  size="large"
                  icon={<FileWarning className="w-4 h-4" />}
                  onClick={printNotice}
                  className="!rounded-lg !h-11 !px-6"
                >
                  打印通知书
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<Send className="w-4 h-4" />}
                  loading={sending}
                  disabled={supplementList.length === 0}
                  onClick={handleSendNotice}
                  className="!rounded-lg !h-11 !px-8"
                  style={{ backgroundColor: '#1E40AF' }}
                >
                  发送补正通知
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-6 sticky top-6 h-fit">
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">补正统计</div>
            </div>
            <div className="gov-card-body space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Card
                  className="!rounded-xl !border-2 !border-red-100 !bg-gradient-to-br !from-red-50 !to-rose-50 !shadow-none text-center !p-3"
                  styles={{ body: { padding: '16px 8px' } }}
                >
                  <div className="text-3xl font-black text-red-600">{highCount}</div>
                  <div className="text-[11px] text-red-500 mt-1 font-medium">高优先</div>
                </Card>
                <Card
                  className="!rounded-xl !border-2 !border-amber-100 !bg-gradient-to-br !from-amber-50 !to-orange-50 !shadow-none text-center !p-3"
                  styles={{ body: { padding: '16px 8px' } }}
                >
                  <div className="text-3xl font-black text-amber-600">{midCount}</div>
                  <div className="text-[11px] text-amber-500 mt-1 font-medium">中优先</div>
                </Card>
                <Card
                  className="!rounded-xl !border-2 !border-emerald-100 !bg-gradient-to-br !from-emerald-50 !to-green-50 !shadow-none text-center !p-3"
                  styles={{ body: { padding: '16px 8px' } }}
                >
                  <div className="text-3xl font-black text-emerald-600">{lowCount}</div>
                  <div className="text-[11px] text-emerald-500 mt-1 font-medium">低优先</div>
                </Card>
              </div>

              <Divider className="!my-3" />

              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">申请人信息</div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={44}
                      icon={<User className="w-5 h-5 text-slate-400" />}
                      className="!bg-white !border !border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800">{noticeContent.applicantName}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {noticeContent.applicantIdCard}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                      <div className="text-slate-400 text-[10px] mb-0.5">联系电话</div>
                      <div className="font-mono text-slate-700 font-semibold">
                        {noticeContent.applicantPhone}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 border border-slate-100">
                      <div className="text-slate-400 text-[10px] mb-0.5">办件类型</div>
                      <div className="text-slate-700 font-semibold truncate">
                        {noticeContent.caseType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Divider className="!my-3" />

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-600 mb-2">补正摘要</div>
                {supplementList.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    暂无补正项
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                    {supplementList.map((item, idx) => {
                      const prColor = {
                        高: 'border-red-300 bg-red-50/50',
                        中: 'border-amber-300 bg-amber-50/50',
                        低: 'border-emerald-300 bg-emerald-50/50',
                      }[item.priority];
                      const prTextColor = {
                        高: 'text-red-600',
                        中: 'text-amber-600',
                        低: 'text-emerald-600',
                      }[item.priority];
                      return (
                        <div
                          key={item.id}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border ${prColor}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${prTextColor} bg-white border`}
                          >
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 truncate">
                              {item.materialName || '（未命名）'}
                            </div>
                            {item.deadline && (
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                截止：{item.deadline}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Card
            className="!rounded-xl !border-2 !border-gradient !bg-gradient-to-br !from-amber-50 !to-orange-50 !shadow-none"
            styles={{ body: { padding: '20px' } }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="font-bold text-amber-800 text-sm mb-1">补正处置规范</div>
                <ul className="text-[11px] text-amber-700/80 space-y-1 leading-relaxed list-disc pl-4">
                  <li>补正期限默认按话术库配置，可根据实际调整</li>
                  <li>高优先事项建议同时电话联系申请人确认</li>
                  <li>发送通知后请及时跟踪补正进度</li>
                  <li>未按时补正的需按规定记录并作退件处理</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
