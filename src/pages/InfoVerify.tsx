import PageLayout from '@/components/layout/PageLayout';
import InfoVerifyModule from '@/modules/InfoVerify';

export default function InfoVerify() {
  return (
    <PageLayout title="信息核验" subtitle="证件信息读取与一致性比对" activeNav="info-verify">
      <InfoVerifyModule />
    </PageLayout>
  );
}
