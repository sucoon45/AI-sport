import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, Trophy, Wallet, Bell, Settings, LogOut, Cpu } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'AI Predictions', icon: Cpu, href: '/predictions' },
    { name: 'Live Matches', icon: Trophy, href: '/matches' },
    { name: 'Users', icon: Users, href: '/users' },
    { name: 'Financials', icon: Wallet, href: '/financials' },
    { name: 'Notifications', icon: Bell, href: '/notifications' },
  ];

  return (
    <div className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <Image src="/logo.png" alt="BetMind AI Logo" width={32} height={32} className="rounded-lg" />
        <span className="font-bold text-xl tracking-tight">BetMind AI <span className="text-primary text-xs ml-1">ADMIN</span></span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-400/5 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
