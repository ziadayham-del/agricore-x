const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'src', 'components');

const agriFiles = {
  'SoilMoistureCard.tsx': \`'use client';
import { Card } from '@/components/ui/Card';
import { Droplet } from 'lucide-react';

export function SoilMoistureCard({ value, unit, bedName }: any) {
  const isLow = value < 60;
  return (
    <Card className={\\\`p-4 border-l-4 \${isLow ? 'border-l-amber' : 'border-l-emerald'}\\\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Droplet size={14}/> {bedName}</span>
      <div className="flex items-baseline gap-1">
        <span className={\\\`text-3xl \${isLow ? 'text-amber' : 'text-emerald'}\\\`}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}\`,

  'TemperatureCard.tsx': \`'use client';
import { Card } from '@/components/ui/Card';
import { Thermometer } from 'lucide-react';

export function TemperatureCard({ value, unit }: any) {
  const isHigh = value > 30;
  return (
    <Card className={\\\`p-4 border-l-4 \${isHigh ? 'border-l-coral' : 'border-l-emerald'}\\\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> Ambient Temp</span>
      <div className="flex items-baseline gap-1">
        <span className={\\\`text-3xl \${isHigh ? 'text-coral' : 'text-emerald'}\\\`}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}\`,

  'HumidityCard.tsx': \`'use client';
import { Card } from '@/components/ui/Card';
import { Wind } from 'lucide-react';

export function HumidityCard({ value, unit }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-azure">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Wind size={14}/> Humidity</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-azure">{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}\`,

  'LightIntensityCard.tsx': \`'use client';
import { Card } from '@/components/ui/Card';
import { Sun } from 'lucide-react';

export function LightIntensityCard({ value, unit }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-amber">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Sun size={14}/> Light DLI</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-amber">{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}\`
};

for (const [file, content] of Object.entries(agriFiles)) {
  fs.writeFileSync(path.join(baseDir, 'agriculture', file), content);
}
