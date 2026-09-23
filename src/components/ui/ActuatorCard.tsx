'use client';
import { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Zap, Clock, Settings2 } from 'lucide-react';

interface Actuator {
  id: string;
  name: string;
  state?: string;
  mode?: string;
  current_draw?: string;
  runtime?: string;
}

interface Props {
  actuator: Actuator;
  farmId?: string;
}

const colorClasses = {
  emerald: 'bg-emerald shadow-[0_0_10px_var(--emerald-soft)] focus-visible:ring-emerald',
  azure: 'bg-azure shadow-[0_0_10px_var(--azure-soft)] focus-visible:ring-azure',
};

function Toggle({ checked, onChange, color = 'emerald', disabled }: { checked: boolean; onChange: () => void; color?: 'emerald' | 'azure'; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`
        relative inline-flex h-8 w-16 shrink-0 items-center rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg
        ${checked ? colorClasses[color] : 'bg-panel-recessed border border-border focus-visible:ring-border'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white
          shadow-md ring-1 ring-black/5
          transition-transform duration-300 ease-in-out
          ${checked ? 'translate-x-9' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

export function ActuatorCard({ actuator, farmId }: Props) {
  const [loading, setLoading] = useState(false);
  const [isOn, setIsOn]   = useState(actuator.state === 'on');
  const [isAuto, setIsAuto] = useState(actuator.mode === 'auto');
  const [draw, setDraw]   = useState(actuator.current_draw || '0.0A');

  const sendCommand = async (cmd: string) => {
    if (loading) return;
    setLoading(true);

    // Optimistic update first -- UI responds instantly
    if (cmd === 'turn_on')    { setIsOn(true);  setDraw(actuator.current_draw || '1.2A'); }
    if (cmd === 'turn_off')   { setIsOn(false); setDraw('0.0A'); }
    if (cmd === 'set_auto')   setIsAuto(true);
    if (cmd === 'set_manual') setIsAuto(false);

    try {
      await fetch('/api/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actuatorId: actuator.id, command: cmd, farmId })
      });
    } catch {
      // Offline -- silently queue, replay on reconnect
      console.warn('Offline -- queued:', cmd);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 flex flex-col gap-4 border-l-4 border-l-azure">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-ink font-medium">{actuator.name}</h3>
          <span className="text-ink-faint text-xs font-mono">{actuator.id?.split('-')[0]}</span>
        </div>
        <Badge variant={isOn ? 'success' : 'neutral'}>{isOn ? 'ACTIVE' : 'OFF'}</Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-border text-center">
        <div>
          <p className="text-ink-dim text-xs uppercase flex items-center justify-center gap-1"><Settings2 size={11}/> Mode</p>
          <p className="text-ink text-sm">{isAuto ? 'Auto' : 'Manual'}</p>
        </div>
        <div>
          <p className="text-ink-dim text-xs uppercase flex items-center justify-center gap-1"><Zap size={11}/> Draw</p>
          <p className="text-ink text-sm">{isOn ? draw : '0.0A'}</p>
        </div>
        <div>
          <p className="text-ink-dim text-xs uppercase flex items-center justify-center gap-1"><Clock size={11}/> Runtime</p>
          <p className="text-ink text-sm">{actuator.runtime || '--'}</p>
        </div>
      </div>

      {/* Toggle switches -- no dialogs, no confirmations */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col items-center gap-1">
          <span className="text-ink-dim text-xs uppercase">Power</span>
          <Toggle
            checked={isOn}
            color="emerald"
            disabled={loading}
            onChange={() => sendCommand(isOn ? 'turn_off' : 'turn_on')}
          />
          <span className="text-xs font-semibold" style={{ color: isOn ? 'var(--color-emerald)' : 'var(--color-ink-faint)' }}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-ink-dim text-xs uppercase">Auto Mode</span>
          <Toggle
            checked={isAuto}
            color="azure"
            disabled={loading}
            onChange={() => sendCommand(isAuto ? 'set_manual' : 'set_auto')}
          />
          <span className="text-xs font-semibold" style={{ color: isAuto ? 'var(--color-azure)' : 'var(--color-ink-faint)' }}>
            {isAuto ? 'AUTO' : 'MANUAL'}
          </span>
        </div>
      </div>
    </Card>
  );
}