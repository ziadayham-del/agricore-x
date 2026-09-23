export const runtime = 'edge';

import { PageContainer } from '@/components/layout/PageContainer';
import { SecurityCamera } from '@/components/security/SecurityCamera';
import { Card } from '@/components/ui/Card';

export default function CropCameraPage() {
  return (
    <PageContainer title="CROP INTELLIGENCE CAMERA">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityCamera name="CAM-03 Crop Canopy (ESP32-CAM)" streamUrl="http://agricore.local/cam3/stream" failbackImg="/placeholder.jpg" />
          </div>
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-2">AI Analysis Status</h3>
              <p className="text-ink text-sm">Last analyzed: 14 mins ago</p>
              <p className="text-emerald text-sm font-medium mt-2">Health Score: 92/100</p>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
