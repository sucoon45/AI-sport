"use client";

import { useState } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  RefreshCw,
  Clock,
  MapPin,
  Circle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState([
    { id: 1, home: 'Real Madrid', away: 'Barcelona', score: '2 - 1', time: '65\'', league: 'La Liga', status: 'Live', probability: '82%' },
    { id: 2, home: 'Man City', away: 'Arsenal', score: '0 - 0', time: '12\'', league: 'Premier League', status: 'Live', probability: '65%' },
    { id: 3, home: 'Napoli', away: 'Inter Milan', score: '1 - 1', time: '88\'', league: 'Serie A', status: 'Live', probability: '74%' },
    { id: 4, home: 'Liverpool', away: 'Chelsea', score: '0 - 0', time: '15:30', league: 'Premier League', status: 'Upcoming', probability: '91%' },
    { id: 5, home: 'PSG', away: 'Lyon', score: '0 - 0', time: '19:45', league: 'Ligue 1', status: 'Upcoming', probability: '88%' },
  ]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Matches</h1>
          <p className="text-text-muted mt-1">Real-time match data and AI probability monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl font-bold text-text-muted hover:text-primary hover:border-primary/50 transition-all">
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-3xl border border-border flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Activity className="text-accent w-7 h-7" />
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium">Active Matches</p>
            <h3 className="text-2xl font-bold mt-0.5">12</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-border flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
            <Trophy className="text-secondary w-7 h-7" />
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium">Top Leagues</p>
            <h3 className="text-2xl font-bold mt-0.5">5</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border border-border flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="text-primary w-7 h-7" />
          </div>
          <div>
            <p className="text-text-muted text-sm font-medium">Avg. Confidence</p>
            <h3 className="text-2xl font-bold mt-0.5">78.4%</h3>
          </div>
        </div>
      </div>

      {/* Match Table */}
      <div className="glass rounded-[32px] border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface/50 border-b border-border text-text-muted text-xs uppercase tracking-widest font-black">
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Match</th>
              <th className="px-8 py-6">League</th>
              <th className="px-8 py-6">Score / Time</th>
              <th className="px-8 py-6">AI Probability</th>
              <th className="px-8 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {matches.map((m) => (
              <tr key={m.id} className="hover:bg-primary/5 transition-all group cursor-pointer">
                <td className="px-8 py-6">
                  {m.status === 'Live' ? (
                    <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/20 px-3 py-1 rounded-lg">
                      <Circle size={8} className="fill-red-400 text-red-400 animate-pulse" />
                      <span className="text-red-400 font-bold text-[10px] uppercase tracking-widest">LIVE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-text-muted/10 border border-text-muted/20 px-3 py-1 rounded-lg">
                      <Clock size={10} className="text-text-muted" />
                      <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest">SCHEDULED</span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground text-sm tracking-tight">{m.home} vs {m.away}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-text-muted group-hover:text-primary transition-colors">
                    <MapPin size={14} />
                    <span className="text-xs font-semibold">{m.league}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-foreground text-sm">{m.score}</span>
                    <span className="text-[10px] font-bold text-text-muted mt-0.5">{m.time}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 w-24 bg-surface rounded-full overflow-hidden border border-border">
                      <div className="h-full bg-secondary" style={{ width: m.probability }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{m.probability}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all">
                    Details
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
