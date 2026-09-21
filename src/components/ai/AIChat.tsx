'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AIMessage } from './AIMessage';
import { AIThinkingIndicator } from './AIThinkingIndicator';
import { AIInsightCard } from './AIInsightCard';
import { Send } from 'lucide-react';

export function AIChat({ farmId }: any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([{ role: 'assistant', content: 'Hello! I am your AI Farm Assistant. I can analyze soil conditions, track energy usage, and diagnose system faults. What would you like to check today?' }]);
  const [loading, setLoading] = useState(false);
  const [latestInsight, setLatestInsight] = useState<any>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const q = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    setLatestInsight(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, farmId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.summary }]);
      setLatestInsight(data);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-3xl mx-auto h-[600px]">
      <Card className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        {messages.map((m, i) => <AIMessage key={i} role={m.role} content={m.content} />)}
        {loading && <AIThinkingIndicator />}
        {latestInsight && <div className="pl-11"><AIInsightCard insight={latestInsight} /></div>}
      </Card>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about crop conditions, faults, or power usage..." 
          className="flex-1 bg-panel border border-border rounded px-4 py-2 text-ink focus:outline-none focus:border-azure"
        />
        <Button onClick={handleSend} disabled={loading} className="gap-2"><Send size={16}/> Ask AI</Button>
      </div>
    </div>
  );
}