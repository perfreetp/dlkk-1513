import { useComboArrangeStore } from '@/store/comboArrangeStore';
import { Printer, Download, Eye, FileCheck2 } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import { cn } from '@/lib/utils';

const deptContactColor: Record<string, string> = {
  公安: 'text-geekblue-600 bg-geekblue-50',
  人社: 'text-purple-600 bg-purple-50',
  医保: 'text-cyan-600 bg-cyan-50',
  卫健: 'text-green-600 bg-green-50',
};

export default function NoticePreview() {
  const { noticeData, selectedItemIds, itemList } = useComboArrangeStore();

  const displayItems = itemList.filter((i) => selectedItemIds.includes(i.id));
  const totalMaterials = displayItems.reduce((sum, i) => sum + i.materialCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="text-lg font-semibold text-slate-800">一次告知单预览</h2>
          <span className="text-xs text-slate-400 font-normal">A4 210×297mm 政务纸张效果</span>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="打印告知单">
            <Button
              size="small"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
              className="!rounded-lg"
            >
              打印
            </Button>
          </Tooltip>
          <Tooltip title="下载PDF">
            <Button
              size="small"
              icon={<Download className="w-3.5 h-3.5" />}
              className="!rounded-lg"
            >
              下载
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
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='160' viewBox='0 0 600 160'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f1f5f9' font-family='Source Han Sans SC, SimSun, sans-serif' font-size='28' font-weight='bold' transform='rotate(-25 300 80)'%3E出生一件事一次告知单%3C/text%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            opacity: 0.8,
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-2 z-10"
          style={{
            background: 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 50%, #1E40AF 100%)',
          }}
        />

        <div className="relative z-10 p-12 pt-14 h-full flex flex-col">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#1E40AF]/10 flex items-center justify-center border-2 border-[#1E40AF]/20">
                <Eye className="w-7 h-7 text-[#1E40AF]" />
              </div>
            </div>
            <h1
              className="text-3xl font-bold tracking-widest mb-2"
              style={{ fontFamily: 'SimSun, "Source Han Sans SC", serif', color: '#1E293B' }}
            >
              出生一件事一次告知单
            </h1>
            <div className="h-0.5 w-32 mx-auto bg-[#1E40AF] rounded-full mb-3" />
            <div className="flex items-center justify-center gap-8 text-xs text-slate-500 font-mono">
              <span>告知单号：{noticeData.noticeNo}</span>
              <span>签发日期：{noticeData.issueDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200">
                <div className="w-1 h-4 bg-[#1E40AF] rounded" />
                <h3 className="font-bold text-slate-800 text-sm">办事人信息</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">申请人：</span>
                  <span className="text-slate-800 font-medium flex-1 border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.name}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">证件号码：</span>
                  <span className="text-slate-800 font-medium flex-1 font-mono text-xs border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.idCardNo}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">联系电话：</span>
                  <span className="text-slate-800 font-medium flex-1 font-mono border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.phone}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">户籍地址：</span>
                  <span className="text-slate-800 font-medium flex-1 text-xs leading-relaxed">
                    {noticeData.applicant.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200">
                <div className="w-1 h-4 bg-emerald-500 rounded" />
                <h3 className="font-bold text-slate-800 text-sm">新生儿信息</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">姓　名：</span>
                  <span className="text-slate-800 font-medium flex-1 border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.babyName}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">性　别：</span>
                  <span className="text-slate-800 font-medium flex-1 border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.babyGender}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-20 shrink-0">出生日期：</span>
                  <span className="text-slate-800 font-medium flex-1 font-mono border-b border-dotted border-slate-300 pb-0.5">
                    {noticeData.applicant.babyBirthDate}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-slate-500 w-20 shrink-0 pt-0.5">联办事项：</span>
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {displayItems.map((item) => (
                      <span
                        key={item.id}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {item.name.split('-')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
              <div className="w-1 h-4 bg-amber-500 rounded" />
              <h3 className="font-bold text-slate-800 text-sm">联办事项清单</h3>
              <span className="ml-auto text-xs text-slate-400">
                共 {displayItems.length} 项 · 需材料 {totalMaterials} 份
              </span>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 w-12">
                    序号
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">
                    事项名称
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 w-20">
                    办理部门
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700 w-28">
                    办理时限
                  </th>
                  <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-700 w-16">
                    材料数
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="border border-slate-200 px-3 py-2 text-slate-600 text-center">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-800 font-medium">
                      {item.name}
                    </td>
                    <td className="border border-slate-200 px-3 py-2">
                      <span
                        className={cn(
                          'text-[11px] px-1.5 py-0.5 rounded font-medium',
                          deptContactColor[item.department]
                        )}
                      >
                        {item.department}
                      </span>
                    </td>
                    <td className="border border-slate-200 px-3 py-2 text-slate-600">
                      {item.timeLimit}
                    </td>
                    <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-[#1E40AF]">
                      {item.materialCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
              <div className="w-1 h-4 bg-rose-500 rounded" />
              <h3 className="font-bold text-slate-800 text-sm">材料清单</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {noticeData.materials.slice(0, Math.min(noticeData.materials.length, 6)).map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-slate-50/60 rounded px-3 py-2 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-white text-[#1E40AF] font-bold flex items-center justify-center text-[10px] border border-slate-200 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium">{m.name}</span>
                  <span className="ml-auto text-slate-400">×{m.count}</span>
                  {m.remark && (
                    <span className="text-amber-600 text-[10px] bg-amber-50 px-1.5 py-0.5 rounded">
                      {m.remark}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
              <div className="w-1 h-4 bg-cyan-500 rounded" />
              <h3 className="font-bold text-slate-800 text-sm">办理时限说明</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 rounded px-4 py-3 border-l-4 border-cyan-400">
              {noticeData.timeLimitDesc}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
              <div className="w-1 h-4 bg-violet-500 rounded" />
              <h3 className="font-bold text-slate-800 text-sm">各部门联系电话</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {noticeData.contacts.map((c) => (
                <div
                  key={c.department}
                  className="flex items-center gap-3 bg-slate-50/60 rounded px-3 py-2 text-xs"
                >
                  <span
                    className={cn(
                      'w-10 text-center font-bold rounded px-2 py-0.5 shrink-0',
                      deptContactColor[c.department]
                    )}
                  >
                    {c.department}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 font-mono font-semibold">{c.phone}</div>
                    <div className="text-slate-400 text-[10px] truncate">{c.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="grid grid-cols-2 gap-12 mb-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-slate-600">办事人确认签字：</span>
                  <div className="flex-1 mx-2 border-b border-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">日期：</span>
                  <div className="flex-1 mx-2 border-b border-slate-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-slate-600">经办人签字：</span>
                  <div className="flex-1 mx-2 border-b border-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">日期：</span>
                  <div className="flex-1 mx-2 border-b border-slate-400" />
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-dashed border-slate-200">
              本告知单一式两份，办事人和受理窗口各执一份 · 政务服务热线：12345
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
