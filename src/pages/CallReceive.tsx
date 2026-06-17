import PageLayout from '@/components/layout/PageLayout';
import CallReceiveModule from '@/modules/CallReceive';

export default function CallReceive() {
  return (
    <PageLayout title="叫号接件" subtitle="叫号管理与快速建单受理" activeNav="call-receive">
      <CallReceiveModule />
    </PageLayout>
  );
}
