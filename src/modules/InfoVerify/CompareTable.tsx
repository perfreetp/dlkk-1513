import { Table, Tag, Alert, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSearch,
  ArrowRightLeft,
} from 'lucide-react';
import { useVerifyStore, type CertType } from '@/store/verifyStore';
import { cn } from '@/lib/utils';

interface CompareRow {
  key: string;
  certType: CertType;
  certName: string;
  fieldName: string;
  electronic: string;
  ocr: string;
  match: boolean;
}

interface CompareTableProps {
  className?: string;
}

const certGroupColors: Record<CertType, { bg: string; text: string }> = {
  birthCert: { bg: 'bg-pink-50', text: 'text-pink-700' },
  fatherIdCard: { bg: 'bg-blue-50', text: 'text-blue-700' },
  motherIdCard: { bg: 'bg-rose-50', text: 'text-rose-700' },
  marriageCert: { bg: 'bg-purple-50', text: 'text-purple-700' },
};

export default function CompareTable({ className }: CompareTableProps) {
  const { certs, compareResults } = useVerifyStore();

  const allSuccess = Object.values(certs).every((c) => c.status === 'success');
  const hasResults = Object.keys(compareResults).length > 0;

  const dataSource: CompareRow[] = Object.entries(compareResults).map(([key, value]) => {
    const [certName, fieldName] = key.split('-');
    const certType = (Object.keys(certs) as CertType[]).find(
      (t) => certs[t].name === certName,
    ) || 'birthCert';
    return {
      key,
      certType,
      certName,
      fieldName,
      electronic: value.electronic,
      ocr: value.ocr,
      match: value.match,
    };
  });

  const matchedCount = dataSource.filter((r) => r.match).length;
  const mismatchedCount = dataSource.filter((r) => !r.match).length;

  const columns: ColumnsType<CompareRow> = [
    {
      title: (
        <div className="flex items-center gap-2 text-slate-700">
          <FileSearch className="h-4 w-4" />
          <span>证照名称 / 字段</span>
        </div>
      ),
      key: 'certField',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div className="space-y-1">
          <Tag
            className={cn(
              '!m-0 !border-none text-xs font-medium',
              certGroupColors[record.certType].bg,
              certGroupColors[record.certType].text,
            )}
          >
            {record.certName}
          </Tag>
          <p className="text-sm font-medium text-slate-700 mt-1 !m-0">
            {record.fieldName}
          </p>
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 text-slate-700">
          <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
          <span>电子证照信息</span>
          <Tag color="blue" className="!m-0 !text-xs">
            权威数据源
          </Tag>
        </div>
      ),
      key: 'electronic',
      dataIndex: 'electronic',
      width: 280,
      render: (value: string, record) => (
        <div
          className={cn(
            'rounded-lg border p-2.5 text-sm',
            record.match
              ? 'border-green-200 bg-green-50/50 text-slate-700'
              : 'border-red-200 bg-red-50 text-red-700',
          )}
        >
          {value || <span className="text-slate-400 italic">— 无数据 —</span>}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center justify-center">
          <ArrowRightLeft className="h-4 w-4 text-slate-400" />
        </div>
      ),
      key: 'compare',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <div className="flex flex-col items-center gap-1">
          {record.match ? (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span className="text-xs font-medium text-green-600">一致</span>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-red-500" />
              <span className="text-xs font-medium text-red-600">不一致</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-2 text-slate-700">
          <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
          <span>OCR 识别信息</span>
          <Tag color="gold" className="!m-0 !text-xs">
            扫描识别
          </Tag>
        </div>
      ),
      key: 'ocr',
      dataIndex: 'ocr',
      width: 280,
      render: (value: string, record) => (
        <div
          className={cn(
            'rounded-lg border p-2.5 text-sm',
            record.match
              ? 'border-green-200 bg-green-50/50 text-slate-700'
              : 'border-red-200 bg-red-50 text-red-700 font-semibold',
          )}
        >
          {value || <span className="text-slate-400 italic">— 无数据 —</span>}
          {record.match === false && value && (
            <div className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
              <AlertTriangle className="h-3 w-3" />
              与电子证照不一致
            </div>
          )}
        </div>
      ),
    },
  ];

  if (!allSuccess && !hasResults) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <ArrowRightLeft className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">证件比对对照</h3>
              <p className="text-sm text-slate-500">请先完成所有证照读取，系统将自动进行比对核验</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="space-y-2">
                <p className="text-slate-600 font-medium">等待证照读取完成</p>
                <p className="text-sm text-slate-400">
                  全部证照读取成功后，将自动展示电子证照与OCR识别结果的比对信息
                </p>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <ArrowRightLeft className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">证件比对对照</h3>
            <p className="text-sm text-slate-500">
              电子证照信息与 OCR 识别信息逐项比对
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              一致 {matchedCount} 项
            </span>
          </div>
          {mismatchedCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                不一致 {mismatchedCount} 项
              </span>
            </div>
          )}
        </div>
      </div>

      {mismatchedCount > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<AlertTriangle className="h-5 w-5" />}
          message={`发现 ${mismatchedCount} 项不一致信息`}
          description="请仔细核对不一致字段，确保证照信息准确无误后再进行后续流程。红色标记为不一致项，建议人工核实原件。"
        />
      )}

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="middle"
          scroll={{ x: 900 }}
          rowClassName={(record) =>
            cn(
              'transition-colors',
              !record.match && 'bg-red-50/30 hover:!bg-red-50/50',
            )
          }
        />
      </div>
    </div>
  );
}
