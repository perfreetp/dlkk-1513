import PageLayout from '@/components/layout/PageLayout';
import ArchiveModule from '@/modules/Archive';

export default function Archive() {
  return (
    <PageLayout title="办结归档" subtitle="双登记与办件流向归档" activeNav="archive">
      <ArchiveModule />
    </PageLayout>
  );
}
