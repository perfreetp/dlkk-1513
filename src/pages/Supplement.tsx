import PageLayout from '@/components/layout/PageLayout';
import SupplementModule from '@/modules/Supplement';

export default function Supplement() {
  return (
    <PageLayout title="补正处置" subtitle="标准话术与补正通知生成" activeNav="supplement">
      <SupplementModule />
    </PageLayout>
  );
}
