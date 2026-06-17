import { useSupplementStore, type PriorityLevel } from '@/store/supplementStore';
import {
  FileWarning,
  Printer,
  Download,
  Mail,
  Send,
  Phone,
  MapPin,
  User,
  FileText,
} from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { cn } from '@/lib/utils';

const priorityLabel: Record<PriorityLevel, { cn: string; text: string }> = {
  高: { cn: 'text-red-700 bg-red-50 border-red-200', text: '紧急' },
  中: { cn: 'text-amber-700 bg-amber-50 border-amber-200', text: '一般' },
  低: { cn: 'text-emerald-700 bg-emerald-50 border-emerald-200', text: '普通' },
};

export default function NoticeGenerator() {
  const { noticeContent, generateNoticeFromList, printNotice } = useSupplementStore();

  const hasContent = noticeContent.mainContent.trim().length > 0 || noticeContent.supplements.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-lg font-semibold text-slate-800">补正通知书预览</h2>
          <span className="text-xs text-slate-400 font-normal">A4 政务纸张效果</span>
        </div>

        <div className="flex items-center gap-2">
          {!hasContent && (
            <Tooltip title="根据补正清单自动生成通知内容">
              <Button
                size="small"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={generateNoticeFromList}
                className="!rounded-lg"
              >
                生成内容
              </Button>
            </Tooltip>
          )}
          <Tooltip title="发送短信通知">
            <Button size="small" icon={<Phone className="w-3.5 h-3.5" />} className="!rounded-lg">
              短信
            </Button>
          </Tooltip>
          <Tooltip title="发送邮件通知">
            <Button size="small" icon={<Mail className="w-3.5 h-3.5" />} className="!rounded-lg">
              邮件
            </Button>
          </Tooltip>
          <Tooltip title="下载补正通知书PDF">
            <Button
              size="small"
              icon={<Download className="w-3.5 h-3.5" />}
              className="!rounded-lg"
            >
              下载
            </Button>
          </Tooltip>
          <Tooltip title="打印补正通知书">
            <Button
              type="primary"
              size="small"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={printNotice}
              className="!rounded-lg"
              style={{ backgroundColor: '#1E40AF' }}
            >
              打印
            </Button>
          </Tooltip>
        </div>
      </div>

      <div
        className="mx-auto bg-white rounded-sm shadow-2xl relative overflow-hidden"
        style={{
          width: '210mm',
          minHeight: '297mm',
          maxWidth: '100%',
          aspectRatio: '210 / 297',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none select-none flex items-center justify-center z-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='140' viewBox='0 0 500 140'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fef3c7' font-family='Source Han Sans SC, SimSun, sans-serif' font-size='24' font-weight='bold' transform='rotate(-20 250 70)'%3E补正通知书%3C/text%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            opacity: 0.7,
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-2 z-10"
          style={{
            background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #D97706 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1 z-10"
          style={{
            background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #D97706 100%)',
          }}
        />

        <div className="relative z-10 p-12 pt-14 h-full flex flex-col">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-200">
                <FileWarning className="w-7 h-7 text-amber-600" />
              </div>
            </div>
            <h1
              className="text-3xl font-bold tracking-widest mb-2 text-amber-700"
              style={{ fontFamily: 'SimSun, "Source Han Sans SC", serif' }}
            >
              办 理 材 料 补 正 通 知 书
            </h1>
            <div className="h-0.5 w-40 mx-auto bg-amber-500 rounded-full mb-3" />
            <div className="flex items-center justify-center gap-10 text-xs text-slate-500 font-mono">
              <span>办件编号：{noticeContent.caseNo}</span>
              <span>受理日期：{noticeContent.caseDate}</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-amber-700 font-semibold mb-1">致：申请人</div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold">{noticeContent.applicantName}</span>（证件号：
                    <span className="font-mono">{noticeContent.applicantIdCard}</span>，联系电话：
                    <span className="font-mono">{noticeContent.applicantPhone}</span>）
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/60 border-l-4 border-[#1E40AF] rounded-r-lg p-4">
              <div className="text-sm text-slate-700 leading-relaxed">
                您于 <span className="font-semibold text-[#1E40AF]">{noticeContent.caseDate}</span>{' '}
                向本窗口申请办理的【
                <span className="font-bold text-slate-800">{noticeContent.caseType}</span>
                】事项，经审核，申请材料不齐全或不符合法定形式，根据《中华人民共和国行政许可法》第三十二条、
                《政务服务事项材料补正告知办法》相关规定，现请您按下列要求补正相关材料：
              </div>
            </div>
          </div>

          {noticeContent.supplements.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
                <div className="w-1.5 h-5 bg-amber-500 rounded" />
                <h3 className="font-bold text-slate-800 text-sm">需补正材料清单</h3>
                <span className="ml-auto text-xs text-slate-400">
                  共 {noticeContent.supplements.length} 项
                </span>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50/80">
                    <th className="border border-amber-100 px-3 py-2 text-left font-semibold text-slate-700 w-12">
                      序号
                    </th>
                    <th className="border border-amber-100 px-3 py-2 text-left font-semibold text-slate-700 w-16">
                      级别
                    </th>
                    <th className="border border-amber-100 px-3 py-2 text-left font-semibold text-slate-700 w-40">
                      材料名称
                    </th>
                    <th className="border border-amber-100 px-3 py-2 text-left font-semibold text-slate-700">
                      补正要求
                    </th>
                    <th className="border border-amber-100 px-3 py-2 text-center font-semibold text-slate-700 w-28">
                      截止日期
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {noticeContent.supplements.map((item, idx) => {
                    const pr = priorityLabel[item.priority];
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="border border-slate-100 px-3 py-2.5 text-center text-slate-600 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-100 px-3 py-2.5 text-center">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border',
                              pr.cn
                            )}
                          >
                            {pr.text}
                          </span>
                        </td>
                        <td className="border border-slate-100 px-3 py-2.5 font-medium text-slate-800">
                          {item.materialName || '（待补充）'}
                        </td>
                        <td className="border border-slate-100 px-3 py-2.5 text-slate-600 leading-relaxed">
                          {item.requirement || '（请填写补正要求）'}
                        </td>
                        <td className="border border-slate-100 px-3 py-2.5 text-center">
                          <span className="font-mono text-slate-700 font-semibold">
                            {item.deadline || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
              <div className="w-1.5 h-5 bg-cyan-500 rounded" />
              <h3 className="font-bold text-slate-800 text-sm">补正事项说明</h3>
            </div>
            <div className="bg-slate-50/60 rounded-lg p-4 text-sm text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap min-h-[120px]">
              {hasContent
                ? noticeContent.mainContent
                : '（点击上方「生成内容」按钮，可根据补正清单自动生成补正说明。也可直接在此处输入自定义说明内容。）'}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                补交地点
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{noticeContent.issueOffice}</p>
            </div>
            <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                联系方式
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold">{noticeContent.contactPerson}</span>
                <span className="mx-2 text-slate-300">|</span>
                <span className="font-mono">{noticeContent.contactPhone}</span>
              </p>
            </div>
          </div>

          <div className="mb-6 bg-amber-50/50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
              <FileWarning className="w-3.5 h-3.5" />
              温馨提示
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. 请您在上述截止日期前补齐所需材料，逾期未补正的，本窗口将根据相关规定视为您自动放弃申请；
              <br />
              2. 本通知书所列补正要求为一次性告知，补正后提交的材料仍不符合要求的，我单位将出具《不予受理通知书》；
              <br />
              3. 补正材料可通过政务服务APP在线上传、邮寄或现场提交等方式递交，建议优先选择线上渠道；
              <br />
              4. 如有疑问，请拨打上述联系电话或政务服务热线 <span className="font-semibold">12345</span> 咨询。
            </p>
          </div>

          <div className="mt-auto pt-6">
            <div className="grid grid-cols-2 gap-12 mb-6">
              <div>
                <div className="text-xs text-slate-500 mb-2">签发单位（盖章）：</div>
                <div className="h-20 border-b border-dashed border-slate-300 flex items-end justify-end pb-1 pr-20 relative">
                  <div className="absolute right-4 bottom-2 w-20 h-20 opacity-30 flex items-center justify-center rounded-full border-4 border-amber-500 rotate-[-8deg]">
                    <span className="text-amber-600 font-bold text-xs text-center leading-tight">
                      政务服务
                      <br />
                      受理专用章
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-3 text-xs">
                  <span className="text-slate-500">签发日期：</span>
                  <span className="font-mono text-slate-700 font-semibold ml-1">
                    {noticeContent.issueDate}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-2">收件人签收：</div>
                <div className="flex items-center justify-between mb-6 h-8">
                  <div className="flex-1 ml-2 border-b border-slate-400" />
                </div>
                <div className="flex items-center text-xs">
                  <span className="text-slate-500">签收日期：</span>
                  <div className="flex-1 ml-2 border-b border-dashed border-slate-300 h-5" />
                </div>
                <div className="flex items-center mt-3 text-xs">
                  <span className="text-slate-500">联系电话：</span>
                  <div className="flex-1 ml-2 border-b border-dashed border-slate-300 h-5" />
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-dashed border-slate-200">
              本通知书一式两份，申请人和受理窗口各执一份，具有同等效力 · 政务服务热线：12345
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
