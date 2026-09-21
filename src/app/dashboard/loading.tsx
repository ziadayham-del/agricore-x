import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function Loading() {
  return (
    <PageContainer title="INITIALIZING...">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-48 p-4 flex flex-col gap-4 border-l-4 border-border/50">
            <div className="h-4 w-1/3 bg-panel-recessed rounded"></div>
            <div className="h-10 w-1/2 bg-panel-recessed rounded mt-auto"></div>
            <div className="h-3 w-full bg-panel-recessed rounded"></div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
