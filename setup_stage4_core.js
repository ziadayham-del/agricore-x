const fs = require('fs');
const path = require('path');

const files = {
  'src/app/api/commands/route.ts': `import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { actuatorId, command, farmId, safetyCheck } = body;

  if (!safetyCheck) return NextResponse.json({ error: 'Safety check bypassed' }, { status: 400 });

  const { error } = await supabase.from('events').insert({
    farm_id: farmId,
    event_type: 'COMMAND_DISPATCH',
    severity: 'medium',
    message: \`Actuator commanded to \${command}\`,
    metadata: { actuatorId, command }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Here we would push to local gateway via TransportLayer or wait for hardware ack
  
  return NextResponse.json({ success: true, message: 'Command dispatched' });
}`,

  'src/components/ui/ConfirmModal.tsx': `'use client';
import { Button } from './Button';

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-panel border border-border rounded shadow-xl">
        <h3 className="text-lg text-ink font-semibold mb-2">{title}</h3>
        <p className="text-ink-dim mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Dispatching...' : 'Confirm Action'}
          </Button>
        </div>
      </div>
    </div>
  );
}`,

  'src/components/ui/ActuatorCard.tsx': `'use client';
import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { ConfirmModal } from './ConfirmModal';
import { Zap, Clock, Settings2 } from 'lucide-react';

export function ActuatorCard({ actuator, onCommand }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCmd, setPendingCmd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuto = actuator.mode === 'auto';
  const isOn = actuator.state === 'on';

  const handleActionClick = (cmd: string) => {
    setPendingCmd(cmd);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onCommand(actuator.id, pendingCmd);
    setLoading(false);
    setModalOpen(false);
  };

  return (
    <Card className="p-5 flex flex-col gap-4 border-l-4 border-l-azure">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-ink font-medium">{actuator.name}</h3>
          <span className="text-ink-faint text-xs font-mono">{actuator.id.split('-')[0]}</span>
        </div>
        <Badge variant={isOn ? 'success' : 'neutral'}>{isOn ? 'ACTIVE' : 'OFF'}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
        <div className="flex flex-col">
          <span className="text-ink-dim text-xs uppercase flex items-center gap-1"><Settings2 size={12}/> Mode</span>
          <span className="text-ink text-sm">{isAuto ? 'Automatic' : 'Manual'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-ink-dim text-xs uppercase flex items-center gap-1"><Zap size={12}/> Draw</span>
          <span className="text-ink text-sm">{isOn ? (actuator.current_draw || '1.2A') : '0.0A'}</span>
        </div>
        <div className="flex flex-col col-span-2">
          <span className="text-ink-dim text-xs uppercase flex items-center gap-1"><Clock size={12}/> Runtime</span>
          <span className="text-ink text-sm">{actuator.runtime || '0h 0m'}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Button variant={isOn ? 'danger' : 'primary'} className="flex-1" onClick={() => handleActionClick(isOn ? 'turn_off' : 'turn_on')}>
          {isOn ? 'Turn OFF' : 'Turn ON'}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => handleActionClick(isAuto ? 'set_manual' : 'set_auto')}>
          {isAuto ? 'Manual Mode' : 'Auto Mode'}
        </Button>
      </div>

      <ConfirmModal 
        isOpen={modalOpen} 
        title="Confirm Hardware Command" 
        message={\`Are you sure you want to send command '\${pendingCmd}' to \${actuator.name}? This will bypass current environmental interlocks.\`}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
        isLoading={loading}
      />
    </Card>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Created ' + filePath);
}
