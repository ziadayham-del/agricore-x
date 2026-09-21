import { Card } from "@/components/ui/Card";

export function PowerFlow() {
  return (
    <Card className="p-5 flex flex-col h-64">
      <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">ENERGY FLOW</h3>
      <div className="flex-1 flex items-center justify-center gap-4 text-ink-dim">
        <span>Solar</span>
        <span className="text-emerald">→</span>
        <span>Battery</span>
        <span className="text-emerald">→</span>
        <span>Loads</span>
      </div>
    </Card>
  );
}