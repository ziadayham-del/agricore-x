import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-panel-recessed hover:bg-border text-ink border border-border",
    secondary: "bg-transparent hover:bg-panel-recessed text-ink-dim border border-border",
    danger: "bg-coral-soft hover:bg-coral-deep text-coral border border-coral/30",
    ghost: "bg-transparent text-ink hover:bg-panel-recessed",
    outline: "bg-transparent border border-border text-ink hover:bg-panel-recessed"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={cn("inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald focus:ring-offset-2 focus:ring-offset-bg", variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
}