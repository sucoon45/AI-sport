"use client";

import { useEffect, useState } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Cpu,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeSubscribers: 420,
    totalPredictions: 4500,
    revenue: 12500,
    successRate: 84.5
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-text-muted mt-1">Platform overview and real-time statistics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-medium hover:bg-border/50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-primary text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity glow-primary">
            New Prediction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          trend="+12.5%" 
          positive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          label="Active Users" 
          value={stats.totalUsers.toLocaleString()} 
          trend="+8.2%" 
          positive={true} 
          icon={Users} 
        />
        <StatCard 
          label="Success Rate" 
          value={`${stats.successRate}%`} 
          trend="+2.1%" 
          positive={true} 
          icon={TrendingUp} 
        />
        <StatCard 
          label="AI Predictions" 
          value={stats.totalPredictions.toLocaleString()} 
          trend="-0.4%" 
          positive={false} 
          icon={Cpu} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Recent Predictions</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-text-muted text-xs uppercase tracking-widest font-bold">
                  <th className="pb-4">Match</th>
                  <th className="pb-4">AI Prediction</th>
                  <th className="pb-4">Confidence</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <TableRow match="Arsenal vs Man City" prediction="Home Win" confidence="92%" status="Success" />
                <TableRow match="Real Madrid vs Barcelona" prediction="Over 2.5" confidence="88%" status="Pending" />
                <TableRow match="Milan vs Inter" prediction="Draw" confidence="75%" status="Failed" />
                <TableRow match="PSG vs Lens" prediction="Away Win" confidence="68%" status="Success" />
                <TableRow match="Liverpool vs Chelsea" prediction="Home Win" confidence="95%" status="Pending" />
              </tbody>
            </table>
          </div>
        </div>

        {/* User Segment Distribution */}
        <div className="glass p-6 rounded-3xl border border-border">
           <h3 className="text-lg font-bold mb-6">Subscription Tiers</h3>
           <div className="space-y-6">
             <TierProgress label="VIP Monthly" value={280} total={1250} color="bg-primary" />
             <TierProgress label="VIP Yearly" value={140} total={1250} color="bg-secondary" />
             <TierProgress label="Free Tier" value={830} total={1250} color="bg-border" />
           </div>
           <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="text-primary w-4 h-4" />
                <span className="text-xs font-bold text-primary uppercase tracking-tighter">Optimization Tip</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                VIP renewals are up 15%. Consider offering a limited-time Yearly upgrade for Free users.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, trend, positive, icon: Icon }: any) => (
  <div className="glass p-6 rounded-3xl border border-border group hover:border-primary/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="text-primary w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${positive ? 'bg-secondary/10 text-secondary' : 'bg-red-400/10 text-red-400'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </div>
    </div>
    <p className="text-text-muted text-sm font-medium">{label}</p>
    <h2 className="text-2xl font-bold mt-1 tracking-tight">{value}</h2>
  </div>
);

const TableRow = ({ match, prediction, confidence, status }: any) => (
  <tr className="hover:bg-primary/5 transition-colors group">
    <td className="py-4 font-bold text-sm tracking-tight">{match}</td>
    <td className="py-4">
      <span className="bg-surface px-3 py-1 rounded-lg border border-border text-xs font-bold text-text-muted group-hover:border-primary/30 group-hover:text-primary transition-all">
        {prediction}
      </span>
    </td>
    <td className="py-4 text-sm font-medium">{confidence}</td>
    <td className="py-4">
      <div className={`text-xs font-black uppercase tracking-widest ${
        status === 'Success' ? 'text-secondary' : 
        status === 'Failed' ? 'text-red-400' : 
        'text-accent'
      }`}>
        {status}
      </div>
    </td>
  </tr>
);

const TierProgress = ({ label, value, total, color }: any) => {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span>{label}</span>
        <span className="text-text-muted">{value} users</span>
      </div>
      <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-border">
        <div 
          className={`h-full ${color} rounded-full`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
