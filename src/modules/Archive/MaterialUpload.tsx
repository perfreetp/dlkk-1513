import { useState } from 'react';
import {
  Card,
  Upload,
  Tag,
  Button,
  Tooltip,
  Popconfirm,
  Empty,
  Space,
  Select,
  message,
  Modal,
  Image,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  Upload as UploadIcon,
  Trash2,
  Eye,
  Image as ImageIcon,
  FileText,
  Layers,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useArchiveStore,
  type ArchiveMaterial,
  type MaterialCategory,
} from '@/store/archiveStore';

const categoryColorMap: Record<MaterialCategory, string> = {
  证件类: 'bg-blue-100 text-blue-700 border-blue-200',
  证明类: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  表单类: 'bg-purple-100 text-purple-700 border-purple-200',
  其他: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function MaterialUpload() {
  const { materials, addMaterial, removeMaterial } = useArchiveStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState('');
  const [filterCategory, setFilterCategory] = useState<MaterialCategory | 'all'>('all');

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type?.startsWith('image/');
    const url = isImage
      ? URL.createObjectURL(file as unknown as Blob)
      : `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=document%20scanned%20paper%20official%20chinese&image_size=square`;

    const categories: MaterialCategory[] = ['证件类', '证明类', '表单类', '其他'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const kbSize = Math.round(file.size / 1024);
    const sizeStr = kbSize > 1024 ? `${(kbSize / 1024).toFixed(1)}MB` : `${kbSize}KB`;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    addMaterial({
      name: file.name.replace(/\.[^.]+$/, ''),
      category: randomCategory,
      uploadTime: timeStr,
      uploader: '当前用户',
      fileSize: sizeStr,
      thumbnail: url,
      pages: Math.ceil(Math.random() * 3) + 1,
    });

    message.success(`${file.name} 上传成功`);
    return false;
  };

  const handlePreview = (material: ArchiveMaterial) => {
    setPreviewUrl(material.thumbnail);
    setPreviewName(material.name);
  };

  const handleDelete = (id: string, name: string) => {
    removeMaterial(id);
    message.success(`已删除材料：${name}`);
  };

  const filteredMaterials =
    filterCategory === 'all'
      ? materials
      : materials.filter((m) => m.category === filterCategory);

  const categoryCounts = materials.reduce<Record<string, number>>(
    (acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    },
    { total: materials.length },
  );

  return (
    <Card
      title={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <UploadIcon size={18} className="text-primary-600" />
            归档材料上传
          </span>
          <Space size={8} wrap>
            <Tag color="blue" className="m-0">
              共 {categoryCounts.total} 份
            </Tag>
            <Select
              size="small"
              value={filterCategory}
              onChange={(v) => setFilterCategory(v)}
              style={{ width: 120 }}
              options={[
                { label: '全部分类', value: 'all' },
                { label: `证件类 (${categoryCounts['证件类'] || 0})`, value: '证件类' },
                { label: `证明类 (${categoryCounts['证明类'] || 0})`, value: '证明类' },
                { label: `表单类 (${categoryCounts['表单类'] || 0})`, value: '表单类' },
                { label: `其他 (${categoryCounts['其他'] || 0})`, value: '其他' },
              ]}
            />
          </Space>
        </div>
      }
      className="h-full"
    >
      <Upload.Dragger
        multiple
        beforeUpload={beforeUpload}
        showUploadList={false}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="!mb-5"
      >
        <p className="mb-2 flex items-center justify-center gap-2">
          <Inbox size={36} className="text-primary-500" />
        </p>
        <p className="mb-1 text-base font-semibold text-slate-700">
          点击或拖拽文件到此区域上传
        </p>
        <p className="text-xs text-slate-500">
          支持 PDF、JPG、PNG、Word 格式，单个文件不超过 50MB
        </p>
      </Upload.Dragger>

      {filteredMaterials.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-sm text-slate-500">
              {filterCategory === 'all' ? '暂无材料，请上传归档材料' : '该分类下暂无材料'}
            </span>
          }
          className="py-10"
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {filteredMaterials.map((material: ArchiveMaterial) => (
            <div
              key={material.id}
              className={cn(
                'group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
              )}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={material.thumbnail}
                  alt={material.name}
                  preview={false}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                        categoryColorMap[material.category],
                      )}
                    >
                      {material.category}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-white/90">
                      <Layers size={10} />
                      {material.pages}页
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Tooltip title="预览">
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<Eye size={14} />}
                      onClick={() => handlePreview(material)}
                    />
                  </Tooltip>
                  <Tooltip title="删除">
                    <Popconfirm
                      title={`确定删除材料「${material.name}」？`}
                      description="删除后不可恢复"
                      okText="确定"
                      cancelText="取消"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDelete(material.id, material.name)}
                    >
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        icon={<Trash2 size={14} />}
                      />
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>

              <div className="p-2.5">
                <h4
                  className="mb-1 truncate text-sm font-semibold text-slate-800"
                  title={material.name}
                >
                  {material.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-0.5">
                    <FileText size={10} />
                    {material.fileSize}
                  </span>
                  <span>
                    {material.uploadTime.slice(5, 16)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-primary-600" />
            材料预览 - {previewName}
          </div>
        }
        open={!!previewUrl}
        onCancel={() => setPreviewUrl(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewUrl(null)}>
            关闭
          </Button>,
          <Button key="download" type="primary">
            下载原件
          </Button>,
        ]}
        width={640}
      >
        {previewUrl && (
          <div className="flex items-center justify-center rounded-lg bg-slate-100 p-4">
            <img
              src={previewUrl}
              alt={previewName}
              className="max-h-[500px] rounded-md shadow-sm"
            />
          </div>
        )}
      </Modal>
    </Card>
  );
}
