const fs = require('fs');
const path = require('path');
const baseDir = path.join(process.cwd(), 'src', 'components', 'power');

fs.writeFileSync(path.join(baseDir, 'BatteryCard.tsx'), `'use client';
import { Card } from '@/components/ui/Card';
import { Battery } from 'lucide-react';
export function BatteryCard({ soc, voltage, draw }: any) {
  const isLow = soc < 30;
  return (
    <Card className={'p-4 border-l-4 ' + (isLow ? 'border-l-amber' : 'border-l-emerald')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Battery size={14}/> Battery Bank</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-3xl ' + (isLow ? 'text-amber' : 'text-emerald')}>{soc}</span>
        <span className="text-ink-faint text-sm">%</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>{voltage}V</span>
        <span>{draw}A draw</span>
      </div>
    </Card>
  );
}`);

fs.writeFileSync(path.join(baseDir, 'SolarPanelCard.tsx'), `'use client';
import { Card } from '@/components/ui/Card';
import { Sun } from 'lucide-react';
export function SolarPanelCard({ power, dailyYield }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-emerald">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Sun size={14}/> Solar Array</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl text-emerald">{power}</span>
        <span className="text-ink-faint text-sm">W</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Daily Yield</span>
        <span>{dailyYield} kWh</span>
      </div>
    </Card>
  );
}`);

fs.writeFileSync(path.join(baseDir, 'GridStatusCard.tsx'), `'use client';
import { Card } from '@/components/ui/Card';
import { Plug } from 'lucide-react';
export function GridStatusCard({ status, voltage }: any) {
  const isActive = status === 'connected';
  return (
    <Card className={'p-4 border-l-4 ' + (isActive ? 'border-l-azure' : 'border-l-coral')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Plug size={14}/> Grid Tie</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-xl ' + (isActive ? 'text-azure' : 'text-coral')}>{isActive ? 'CONNECTED' : 'OFFLINE'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Voltage</span>
        <span>{voltage}V AC</span>
      </div>
    </Card>
  );
}`);

try { fs.unlinkSync(path.join(baseDir, 'PowerCards.tsx')); } catch(e){}
console.log('Split Power Cards');
