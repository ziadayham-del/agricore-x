export const runtime = 'edge';

import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function CropCalendarPage() {
  return (
    <PageContainer title="CROP CALENDAR">
      <Card className="p-6 text-center text-ink-dim">
        <p>Interactive Crop Calendar View</p>
        <p className="text-xs text-ink-faint mt-2">Coming soon in final pass.</p>
      </Card>
    </PageContainer>
  );
}

