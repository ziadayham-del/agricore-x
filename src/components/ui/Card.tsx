import React from 'react';
import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn("bg-panel border border-border rounded-lg overflow-hidden", className)} 
      {...props} 
    />
  );
}