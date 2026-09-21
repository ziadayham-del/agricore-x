'use client';
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
}