import Link from 'next/link';
import { LayoutDashboard, Leaf, Sprout, Zap, ArrowUpToLine, Shield, Settings2, Network, History, ActivitySquare, Settings } from 'lucide-react';
import { LogoutForm } from '@/components/auth/LogoutForm';
import { createClient } from '@/lib/supabase/server';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agriculture', href: '/dashboard/agriculture', icon: Leaf },
  { name: 'Crop Intelligence', href: '/dashboard/crops', icon: Sprout },
  { name: 'Power', href: '/dashboard/power', icon: Zap },
  { name: 'Roof & Tracker', href: '/dashboard/roof-tracker', icon: ArrowUpToLine },
  { name: 'Security & Cameras', href: '/dashboard/security', icon: Shield },
  { name: 'Automation', href: '/dashboard/automation', icon: Settings2 },
  { name: 'Network & Nodes', href: '/dashboard/nodes', icon: Network },
  { name: 'Event Center', href: '/dashboard/events', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ActivitySquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let nodes: any[] = [];
  if (user) {
    const { data: members } = await supabase
      .from('farm_members')
      .select('farm_id')
      .eq('user_id', user.id)
      .limit(1);

    if (members && members.length > 0) {
      const { data: dbNodes } = await supabase
        .from('nodes')
        .select('id, node_code, name, status')
        .eq('farm_id', members[0].farm_id)
        .order('node_code', { ascending: true });
      if (dbNodes) nodes = dbNodes;
    }
  }

  return (
    <aside className="w-16 md:w-64 border-r border-border bg-panel flex flex-col transition-all duration-300 shrink-0">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-md text-ink-dim hover:text-ink hover:bg-panel-recessed transition-colors group"
            >
              <item.icon size={20} className="shrink-0" />
              <span className="hidden md:block text-sm">{item.name}</span>
            </Link>
          ))}
          <div className="my-2 border-t border-border opacity-50" />
          <LogoutForm />
        </nav>
      </div>

      <div className="p-4 border-t border-border bg-panel">
        <h3 className="hidden md:block text-ink-dim text-xs uppercase tracking-wider mb-3">SYSTEM</h3>
        <div className="flex flex-col gap-2">
          {nodes.length === 0 ? (
            <span className="hidden md:block text-ink-faint text-xs">No nodes</span>
          ) : nodes.map(node => (
            <div key={node.id} className="flex items-center justify-center md:justify-start gap-3 px-1 md:px-2">
              <span className="hidden md:block text-ink-dim text-sm font-mono shrink-0">{node.node_code}</span>
              <div className={`w-2 h-2 rounded-full shrink-0 ${node.status === 'online' ? 'bg-emerald' : 'bg-coral'}`} />
              <span className="hidden md:block text-ink text-sm truncate">{node.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}