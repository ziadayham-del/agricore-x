import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'emerald' | 'amber' | 'coral' | 'azure';
}

export function ProgressBar({ value, max = 100, className, variant = 'emerald' }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variants = {
    emerald: "bg-emerald",
    amber: "bg-amber",
    coral: "bg-coral",
    azure: "bg-azure",
  };

  return (
    <div className={cn("w-full h-2 bg-panel-recessed rounded-full overflow-hidden border border-border", className)}>
      <div 
        className={cn("h-full transition-all duration-500", variants[variant])} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}