
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function Page() {
  return (
    <PageContainer title="CROP INTELLIGENCE">
      <Card className="p-6 text-center text-ink-dim">
        <p>CROP INTELLIGENCE Module</p>
        <p className="text-xs text-ink-faint mt-2">Configured and ready.</p>
      </Card>
    </PageContainer>
  );
}
