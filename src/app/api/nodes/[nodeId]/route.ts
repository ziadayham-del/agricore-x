import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ nodeId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const body = await req.json();
  
  const { error } = await supabase.from('nodes').update(body).eq('id', resolvedParams.nodeId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}