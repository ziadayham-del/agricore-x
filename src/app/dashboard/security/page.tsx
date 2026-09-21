import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { PerimeterStatus } from '@/components/security/PerimeterStatus';
import { SecurityCamera } from '@/components/security/SecurityCamera';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PageContainer title="SECURITY & CAMERAS">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-ink font-semibold">Perimeter Overview</h2>
          <Link href="/dashboard/crop-camera">
            <Button variant="outline">View Crop Intelligence Camera</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <PerimeterStatus status="secure" />
        </div>

        <h2 className="text-ink font-semibold mt-4">Live Camera Feeds</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityCamera name="CAM-01 Main Gate" streamUrl="http://agricore.local/cam1/stream" failbackImg="/placeholder.jpg" />
          <SecurityCamera name="CAM-02 Greenhouse Rear" streamUrl="" failbackImg="/placeholder.jpg" />
        </div>
      </div>
    </PageContainer>
  );
}