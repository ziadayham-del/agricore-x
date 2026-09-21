import React from 'react';

export function PageContainer({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {title && <h1 className="text-ink-dim text-xs uppercase tracking-wider mb-4">{title}</h1>}
      {children}
    </div>
  );
}