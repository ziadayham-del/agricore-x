export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const farmId = searchParams.get('farm_id');

  if (!farmId) return NextResponse.json({ error: 'farm_id required' }, { status: 400 });

  const { data, error } = await supabase.from('nodes').select('*').eq('farm_id', farmId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { error } = await supabase.from('nodes').insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
