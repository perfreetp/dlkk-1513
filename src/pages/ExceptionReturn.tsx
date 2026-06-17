import PageLayout from '@/components/layout/PageLayout';
import ExceptionReturnModule from '@/modules/ExceptionReturn';

export default function ExceptionReturn() {
  return (
    <PageLayout title="异常退回" subtitle="异常情形分类与复核提交" activeNav="return">
      <ExceptionReturnModule />
    </PageLayout>
  );
}
