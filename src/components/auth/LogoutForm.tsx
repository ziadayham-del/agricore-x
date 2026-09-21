import { logout } from '@/app/login/actions';
import { LogOut } from 'lucide-react';

export function LogoutForm() {
  return (
    <form action={logout}>
      <button 
        type="submit" 
        className="flex w-full items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-md text-coral hover:bg-coral-soft hover:text-coral-deep transition-colors group"
      >
        <LogOut size={20} className="shrink-0" />
        <span className="hidden md:block text-sm">Sign Out</span>
      </button>
    </form>
  );
}
