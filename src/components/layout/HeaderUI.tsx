'use client';
import { Badge } from "@/components/ui/Badge";
import { Activity } from "lucide-react";
import { useNetworkStore } from "@/store/network";
import { useEffect, useState } from "react";

export function HeaderUI({ farmName }: { farmName: string }) {
  const { active_network } = useNetworkStore();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-panel flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-ink font-semibold tracking-wide">AgriCore X</h2>
        <span className="text-border">|</span>
        <span className="text-ink-dim text-sm hidden md:inline">Farm: {farmName}</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <Badge variant={active_network === 'Offline' ? 'danger' : 'success'} className="gap-2 hidden md:inline-flex transition-colors">
          <Activity size={14} />
          {active_network}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="text-ink-dim text-sm hidden sm:inline">Battery</span>
          <span className="text-emerald text-sm font-medium">82%</span>
        </div>
        <span className="text-ink-faint text-sm font-mono">{time}</span>
      </div>
    </header>
  );
}
