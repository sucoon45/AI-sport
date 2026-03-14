"use client";

import { useEffect, useState } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([
    { id: 1, match: 'Bayern vs Dortmund', type: 'Over 3.5', confidence: 94, status: 'Active', isVip: true, time: '14:30' },
    { id: 2, match: 'Napoli vs Lazio', type: 'Home Win', confidence: 82, status: 'Pending', isVip: false, time: '16:00' },
    { id: 3, match: 'Porto vs Benfica', type: 'Draw', confidence: 65, status: 'Resolved', isVip: true, time: '19:45' },
    { id: 4, match: 'Ajax vs PSV', type: 'Away Win', confidence: 71, status: 'Active', isVip: false, time: '12:15' },
    { id: 5, match: 'Newcastle vs Spurs', type: 'BTTS', confidence: 88, status: 'Active', isVip: true, time: '11:30' },
  ]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Predictions</h1>
          <p className="text-text-muted mt-1">Manage and audit AI-generated signals</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-2xl font-bold hover:opacity-90 transition-all glow-primary">
          <Plus size={18} />
          Create Manual Signal
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search matches or teams..." 
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-2xl focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl font-bold text-text-muted hover:border-primary/50 hover:text-primary transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>
        <div className="flex bg-surface p-1 rounded-2xl border border-border">
          <button className="px-6 py-2 bg-primary text-background rounded-xl font-bold text-sm shadow-lg">New Models</button>
          <button className="px-6 py-2 text-text-muted font-bold text-sm hover:text-foreground transition-colors">Legacy</button>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="glass rounded-[32px] border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-text-muted text-xs uppercase tracking-widest font-black">
              <th className="px-8 py-6">Match & Time</th>
              <th className="px-8 py-6">Signal Type</th>
              <th className="px-8 py-6">Tier</th>
              <th className="px-8 py-6">Stats & Conf.</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {predictions.map((p) => (
              <tr key={p.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-sm tracking-tight">{p.match}</span>
                    <span className="text-text-muted text-xs font-semibold mt-1">Kickoff: {p.time}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-primary font-bold text-[10px] uppercase tracking-tighter">{p.type}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {p.isVip ? (
                    <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">VIP</span>
                  ) : (
                    <span className="text-text-muted text-[10px] font-black uppercase tracking-widest px-2.5 py-1">Free</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 w-24 bg-surface rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-primary" style={{ width: `${p.confidence}%` }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{p.confidence}%</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                      {p.status === 'Active' && <CheckCircle2 size={14} className="text-secondary" />}
                      {p.status === 'Pending' && <AlertCircle size={14} className="text-accent" />}
                      <span className={`text-[11px] font-bold uppercase tracking-tight ${
                        p.status === 'Active' ? 'text-secondary' : 
                        p.status === 'Pending' ? 'text-accent' : 
                        'text-text-muted'
                      }`}>{p.status}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-primary transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model Performance Banner */}
      <div className="p-8 rounded-[40px] bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center glow-primary">
            <Trophy className="text-background w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold">Latest Model Performance: 89.2% Accuracy</h4>
            <p className="text-text-muted text-sm mt-1">Based on the last 500 signals generated by the Poisson-v2 model.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-surface border border-primary/30 rounded-2xl font-bold text-primary hover:bg-primary hover:text-background transition-all">
          Retrain Model
        </button>
      </div>
    </div>
  );
}
