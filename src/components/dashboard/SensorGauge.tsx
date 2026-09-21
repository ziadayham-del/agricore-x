import { Card } from "@/components/ui/Card";

export function SensorGauge() {
  return (
    <Card className="p-5 flex flex-col h-64">
      <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">LIVE SENSOR SUMMARY</h3>
      <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded text-ink-faint">
        Chart placeholder: Soil / Temperature / Humidity
      </div>
    </Card>
  );
}