"use client";

import { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  Shield,
  Wallet,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', tier: 'VIP Yearly', spent: '$299', joined: '2023-11-12', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah.w@test.com', tier: 'VIP Monthly', spent: '$29', joined: '2024-01-05', status: 'Active' },
    { id: 3, name: 'Alex Rivera', email: 'arivera@web.com', tier: 'Free', spent: '$0', joined: '2024-02-15', status: 'Inactive' },
    { id: 4, name: 'Mike Ross', email: 'mike@consulting.com', tier: 'VIP Yearly', spent: '$599', joined: '2023-08-20', status: 'Active' },
    { id: 5, name: 'Elena Gilbert', email: 'elena.g@mystic.com', tier: 'Free', spent: '$0', joined: '2024-03-01', status: 'Active' },
  ]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-text-muted mt-1">Manage platform members and their subscription states</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-2xl font-bold hover:opacity-90 transition-all glow-primary">
          <UserPlus size={18} />
          Manual Registration
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <HighlightCard label="Total Members" value="12,450" icon={Users} color="text-primary" />
        <HighlightCard label="VIP Subscribers" value="3,820" icon={Shield} color="text-secondary" />
        <HighlightCard label="Total Revenue" value="$42.5k" icon={Wallet} color="text-accent" />
        <HighlightCard label="Churn Rate" value="2.4%" icon={TrendingUp} color="text-red-400" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or wallet address..." 
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl font-bold text-text-muted hover:text-primary hover:border-primary/50 transition-all">
          <Filter size={18} />
          Filter Tiers
        </button>
      </div>

      {/* Users Table */}
      <div className="glass rounded-[32px] border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-text-muted text-xs uppercase tracking-widest font-black">
              <th className="px-8 py-6">User</th>
              <th className="px-8 py-6">Tier</th>
              <th className="px-8 py-6">LTV</th>
              <th className="px-8 py-6">Joined</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-background transition-all">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm tracking-tight">{u.name}</span>
                      <span className="text-text-muted text-xs font-semibold">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   {u.tier.includes('VIP') ? (
                     <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-lg">
                       <Shield size={10} className="text-secondary" />
                       <span className="text-secondary font-black text-[10px] uppercase tracking-tighter">{u.tier}</span>
                     </div>
                   ) : (
                     <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest">Free Explorer</span>
                   )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-foreground text-sm">{u.spent}</span>
                    <ArrowUpRight size={12} className="text-secondary" />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-text-muted text-xs font-semibold">{u.joined}</span>
                </td>
                <td className="px-8 py-6">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-secondary' : 'text-text-muted'}`}>
                    {u.status}
                  </div>
                </td>
                <td className="px-8 py-6">
                   <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-colors">
                     <MoreHorizontal size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const HighlightCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="glass p-6 rounded-3xl border border-border">
    <Icon className={`${color} w-5 h-5 mb-4`} />
    <p className="text-text-muted text-xs font-bold uppercase tracking-tighter">{label}</p>
    <h3 className="text-2xl font-black mt-1 tracking-tight">{value}</h3>
  </div>
);
