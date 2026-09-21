import { Card } from "@/components/ui/Card";
import { mockNodes } from "@/lib/mock-data";

export function NodeStatusGrid() {
  return (
    <Card className="p-5 flex flex-col">
      <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">NODE HEALTH</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {mockNodes.map(node => (
          <div key={node.id} className="flex flex-col items-center justify-center p-3 border border-border bg-panel-recessed rounded">
            <span className="text-ink-dim text-sm font-mono mb-2">{node.id}</span>
            <div className={`w-3 h-3 rounded-full mb-2 ${node.status === 'online' ? 'bg-emerald shadow-[0_0_8px_var(--emerald-soft)]' : 'bg-coral shadow-[0_0_8px_var(--coral-soft)]'}`} />
            <span className="text-ink-faint text-xs">{node.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}