import { Card } from "@/components/ui/Card";
import { mockSystemStatus } from "@/lib/mock-data";

export function StatusHeader() {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">System Health</div>
          <div className="text-2xl text-emerald">{mockSystemStatus.health}%</div>
        </div>
        <div>
          <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Network</div>
          <div className="text-2xl text-ink">{mockSystemStatus.activeNetwork}</div>
        </div>
        <div>
          <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Uptime</div>
          <div className="text-2xl text-ink">{mockSystemStatus.uptime}</div>
        </div>
        <div>
          <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Nodes Online</div>
          <div className="text-2xl text-ink">{mockSystemStatus.nodesOnline}/{mockSystemStatus.totalNodes}</div>
        </div>
      </div>
    </Card>
  );
}