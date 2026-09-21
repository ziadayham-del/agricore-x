'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-ink p-8">
      <div className="p-4 bg-coral/10 text-coral rounded-full">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-bold uppercase tracking-wide">System Malfunction</h2>
      <p className="text-ink-dim text-sm max-w-md text-center">{error.message || 'An unexpected fault occurred in the dashboard rendering pipeline.'}</p>
      <Button onClick={() => reset()} variant="primary" className="mt-4">
        REBOOT COMPONENT
      </Button>
    </div>
  );
}
