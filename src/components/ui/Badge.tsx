import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: "bg-panel-recessed text-ink border border-border",
    success: "bg-emerald-soft text-emerald border border-emerald/30",
    warning: "bg-amber-soft text-amber border border-amber/30",
    danger: "bg-coral-soft text-coral border border-coral/30",
    neutral: "bg-azure-soft text-azure border border-azure/30"
  };

  return (
    <span 
      className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variants[variant], className)} 
      {...props} 
    />
  );
}