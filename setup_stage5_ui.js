const fs = require('fs');
const path = require('path');
const baseDir = path.join(process.cwd(), 'src', 'components', 'ai');
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

fs.writeFileSync(path.join(baseDir, 'AIThinkingIndicator.tsx'), `'use client';
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
}`);

fs.writeFileSync(path.join(baseDir, 'AIMessage.tsx'), `'use client';
import { Card } from '@/components/ui/Card';
import { Bot, User } from 'lucide-react';
export function AIMessage({ role, content }: any) {
  const isUser = role === 'user';
  return (
    <div className={'flex gap-3 ' + (isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={'w-8 h-8 rounded flex items-center justify-center shrink-0 ' + (isUser ? 'bg-panel-recessed text-ink' : 'bg-azure text-bg')}>
        {isUser ? <User size={16}/> : <Bot size={16}/>}
      </div>
      <Card className={'p-3 max-w-[80%] ' + (isUser ? 'bg-panel-recessed' : 'border-l-4 border-l-azure')}>
        <p className="text-ink text-sm whitespace-pre-wrap">{content}</p>
      </Card>
    </div>
  );
}`);

fs.writeFileSync(path.join(baseDir, 'AIRecommendation.tsx'), `'use client';
import { Badge } from '@/components/ui/Badge';
export function AIRecommendation({ recommendation }: any) {
  const { action, priority } = recommendation;
  const pColor = priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'neutral';
  return (
    <div className="flex items-center justify-between p-2 border border-border bg-panel-recessed rounded mt-2">
      <span className="text-ink text-sm">{action}</span>
      <Badge variant={pColor}>{priority.toUpperCase()}</Badge>
    </div>
  );
}`);

fs.writeFileSync(path.join(baseDir, 'AIInsightCard.tsx'), `'use client';
import { Card } from '@/components/ui/Card';
import { Lightbulb } from 'lucide-react';
import { AIRecommendation } from './AIRecommendation';
export function AIInsightCard({ insight }: any) {
  return (
    <Card className="p-5 border-l-4 border-l-azure relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3 text-azure">
        <Lightbulb size={18} />
        <h3 className="font-semibold text-ink uppercase tracking-wide text-sm">Automated Insight</h3>
      </div>
      <p className="text-ink text-sm mb-4 leading-relaxed">{insight.summary}</p>
      
      {insight.observations?.length > 0 && (
        <div className="mb-4">
          <span className="text-ink-dim text-xs uppercase mb-2 block">Key Observations:</span>
          <ul className="list-disc pl-4 text-sm text-ink-faint space-y-1">
            {insight.observations.map((obs: string, i: number) => <li key={i}>{obs}</li>)}
          </ul>
        </div>
      )}

      {insight.recommended_actions?.map((rec: any, i: number) => (
        <AIRecommendation key={i} recommendation={rec} />
      ))}
      
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex flex-col w-1/2">
          <span className="text-ink-faint text-xs uppercase mb-1">Confidence</span>
          <div className="w-full h-1.5 bg-panel-recessed rounded overflow-hidden">
            <div className="h-full bg-azure" style={{ width: \`\${(insight.confidence || 0) * 100}%\` }} />
          </div>
        </div>
        <span className="text-ink-faint text-[10px] italic max-w-[40%] text-right">Advisory only. Not a guaranteed agronomic diagnosis.</span>
      </div>
    </Card>
  );
}`);

fs.writeFileSync(path.join(baseDir, 'CropDiagnosisCard.tsx'), `'use client';
import { AIInsightCard } from './AIInsightCard';
export function CropDiagnosisCard({ diagnosis }: any) {
  return <AIInsightCard insight={diagnosis} />;
}`);

fs.writeFileSync(path.join(baseDir, 'AIChat.tsx'), `'use client';
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
      setMessages(prev => [...prev, { role: 'assistant', content: \`Error: \${err.message}\` }]);
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
}`);

console.log('Created AI components');
