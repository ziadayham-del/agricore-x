'use client';
export function AIThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 p-3 text-ink-dim text-sm italic">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-azure animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-azure animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-azure animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      Analyzing agronomic data...
    </div>
  );
}