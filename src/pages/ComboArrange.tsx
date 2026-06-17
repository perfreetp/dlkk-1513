import PageLayout from '@/components/layout/PageLayout';
import ComboArrangeModule from '@/modules/ComboArrange';

export default function ComboArrange() {
  return (
    <PageLayout title="联办编排" subtitle="情形选择与事项组合配置" activeNav="orchestration">
      <ComboArrangeModule />
    </PageLayout>
  );
}
