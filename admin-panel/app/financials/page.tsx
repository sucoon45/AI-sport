"use client";

import { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Landmark, 
  Calendar,
  Filter,
  Search,
  Download
} from 'lucide-react';

export default function FinancialsPage() {
  const [transactions] = useState([
    { id: 'TRX-9128', user: 'James Wilson', type: 'Deposit', amount: 50.00, method: 'Stripe', status: 'Completed', date: 'Oct 12, 14:20' },
    { id: 'TRX-9129', user: 'Maria Garcia', type: 'Withdrawal', amount: 120.00, method: 'Bank Transfer', status: 'Pending', date: 'Oct 12, 15:10' },
    { id: 'TRX-9130', user: 'Robert Chen', type: 'Subscription', amount: 29.99, method: 'Paystack', status: 'Completed', date: 'Oct 12, 16:05' },
    { id: 'TRX-9131', user: 'Sarah Connor', type: 'Deposit', amount: 300.00, method: 'Stripe', status: 'Completed', date: 'Oct 13, 09:30' },
    { id: 'TRX-9132', user: 'Alex Hunter', type: 'Withdrawal', amount: 45.00, method: 'Paypal', status: 'Failed', date: 'Oct 13, 10:15' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-text-muted mt-1">Transaction logs and revenue streams</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-bold hover:bg-border/30 transition-all">
            <Calendar size={18} className="text-primary" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background rounded-xl text-sm font-black hover:opacity-90 transition-all glow-primary">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard label="Total Revenue" value="$42,500.00" trend="+15% vs last month" icon={Landmark} pulse={true} />
        <FinanceCard label="Total Payouts" value="$12,840.50" trend="+5% vs last month" icon={ArrowDownLeft} pulse={false} />
        <FinanceCard label="Active Subscriptions" value="412" trend="+24 new today" icon={CreditCard} pulse={false} />
      </div>

      {/* Transaction Table */}
      <div className="glass rounded-[32px] border border-border overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-surface/30">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search TxID or User..." 
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl text-sm font-bold text-text-muted hover:text-primary transition-all">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-muted text-[10px] uppercase tracking-widest font-black border-b border-border">
              <th className="px-8 py-5">Transaction ID</th>
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Method</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-primary/5 transition-all group">
                <td className="px-8 py-6 text-xs font-bold text-primary transition-all">{tx.id}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-sm tracking-tight">{tx.user}</div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                    tx.type === 'Deposit' ? 'bg-secondary/10 text-secondary' : 
                    tx.type === 'Withdrawal' ? 'bg-red-400/10 text-red-400' : 
                    'bg-primary/10 text-primary'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black text-sm tracking-tighter">
                    {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-8 py-6 text-text-muted text-xs font-bold">{tx.method}</td>
                <td className="px-8 py-6">
                  <div className={`text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full inline-block ${
                    tx.status === 'Completed' ? 'border-secondary/30 text-secondary bg-secondary/5' : 
                    tx.status === 'Pending' ? 'border-accent/30 text-accent bg-accent/5' : 
                    'border-red-400/30 text-red-400 bg-red-400/5'
                  }`}>
                    {tx.status}
                  </div>
                </td>
                <td className="px-8 py-6 text-text-muted text-xs">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FinanceCard = ({ label, value, trend, icon: Icon, pulse }: any) => (
  <div className="glass p-8 rounded-[32px] border border-border relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
    {pulse && (
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 animate-pulse" />
    )}
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-500">
        <Icon className="text-primary w-7 h-7" />
      </div>
    </div>
    <h2 className="text-3xl font-black tracking-tighter mb-1 uppercase">{value}</h2>
    <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
      <span className="text-xs font-bold text-secondary uppercase tracking-tight">{trend}</span>
    </div>
  </div>
);
