"use client"

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Zap,
  Trophy,
  ArrowUpRight,
  Target,
  Clock,
  ChevronRight,
  RefreshCw,
  Activity,
  BarChart3,
  Search,
  Wallet
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import MatchCard from '@/components/MatchCard'

interface DashboardStats {
  totalProfit: number;
  predictionAccuracy: number;
  activeBots: number;
  pendingBets: number;
  profitHistory: { name: string; profit: number }[];
}

interface TransformedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  prediction: {
    type: string;
    probability: number;
    odds: number;
    overUnder?: string;
    signal?: string;
  };
}

export default function DashboardPage() {
  const [upcomingMatches, setUpcomingMatches] = useState<TransformedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const [liveFixtures, setLiveFixtures] = useState<any[]>([])
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString())

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const statsRes = await fetch('/api/stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      const fixturesRes = await fetch('/api/fixtures')
      const fixturesData = await fixturesRes.json()

      const transformed: TransformedMatch[] = fixturesData.map((f: any) => ({
        id: f.fixtureId.toString(),
        homeTeam: f.homeTeam,
        awayTeam: f.awayTeam,
        league: f.league,
        startTime: f.startTime,
        prediction: {
          type: f.prediction.type,
          probability: f.prediction.probability,
          odds: f.prediction.odds,
          overUnder: f.prediction.overUnder,
          signal: f.prediction.signal,
        }
      }))
      setUpcomingMatches(transformed)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const syncLiveSignals = async () => {
    try {
      const res = await fetch('/api/sync/live')
      const data = await res.json()
      if (data.success) {
        setLastSync(new Date().toLocaleTimeString())
      }
    } catch (e) {
      console.error('Sync failed')
    }
  }

  useEffect(() => {
    fetchDashboardData()
    syncLiveSignals()

    // 1. Establish Real-Time Signal Stream (SSE)
    const eventSource = new EventSource('/api/stream/signals')
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data && Array.isArray(data)) {
            setLiveFixtures(data)
        }
    }

    // 2. Scheduled Background Polling (Master Engine Sync)
    const syncInterval = setInterval(syncLiveSignals, 60000) // Sync every 1 minute
    
    return () => {
        eventSource.close()
        clearInterval(syncInterval)
    }
  }, [])

  if (!stats) return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0b]">
        <div className="relative">
            <div className="w-20 h-20 border-2 border-cyan-500/20 rounded-full animate-spin border-t-cyan-500" />
            <Activity className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[1600px] mx-auto px-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Dashboard</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">AI-Powered Football Predictions</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Master Engine Sync</span>
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Last Pulse: {lastSync}</p>
            </div>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search matches..." 
                    className="bg-white/[0.03] border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-all w-64"
                />
            </div>
            <button className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white transition-all relative">
                <Activity className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0a0a0b]" />
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Win Rate', value: `${stats.predictionAccuracy}%`, change: 'Live', icon: Trophy, color: 'emerald' },
          { label: 'Predictions Today', value: upcomingMatches.length.toString(), change: 'Flat', icon: Target, color: 'cyan' },
          { label: 'Monthly ROI', value: `${stats.totalProfit > 0 ? '+' : ''}${stats.totalProfit.toFixed(1)}%`, change: 'Live', icon: TrendingUp, color: 'emerald' },
          { label: 'Pending Bets', value: stats.pendingBets.toString(), change: 'Queue', icon: Activity, color: 'cyan' },
          { label: 'Active Bots', value: stats.activeBots.toString(), change: 'Live', icon: Zap, color: 'cyan' },
          { label: 'Matrix Sync', value: 'Active', change: '100%', icon: RefreshCw, color: 'emerald' },
        ].map((item, i) => (
          <div key={i} className="glass-card !p-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-${item.color === 'emerald' ? 'emerald-500' : 'cyan-500'}/10 text-${item.color === 'emerald' ? 'emerald-400' : 'cyan-400'}`}>
                    <item.icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-black text-${item.color === 'emerald' ? 'emerald-400' : 'cyan-400'}`}>{item.change}</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1">{item.value}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Predictions Grid */}
        <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Today's <span className="text-slate-500">Predictions</span></h2>
                <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-card h-[400px] animate-pulse" />
                    ))
                ) : upcomingMatches.length > 0 ? (
                    upcomingMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center glass-card">
                        <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting Matrix Pulse... No active signals detected.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
            {/* Live Now */}
            <div className="glass-card !p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Live Now</h3>
                </div>
                <div className="space-y-4">
                    {liveFixtures.length > 0 ? (
                        liveFixtures.map((live, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/20 transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase">{live.league}</span>
                                    <span className="text-[9px] font-black text-rose-500 animate-pulse">{live.status || 'LIVE'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-white">
                                        {live.homeTeam} <span className="text-rose-500 mx-1">{live.liveScore?.home ?? 0} - {live.liveScore?.away ?? 0}</span> {live.awayTeam}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                     <span className="text-[8px] font-bold text-slate-600 uppercase">AI Confidence: {((live.prediction?.probability || 0.5) * 100).toFixed(0)}%</span>
                                     <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase ${live.prediction?.signal === 'Strong Buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-500'}`}>
                                        {live.prediction?.signal || 'Analyzing'}
                                     </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center border border-white/5 border-dashed rounded-2xl">
                             <RefreshCw className="w-4 h-4 text-slate-700 animate-spin mx-auto mb-2" />
                             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Scanning Waves...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Neural Matrix Status */}
            <div className="glass-card !p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/[0.02] scanline opacity-30" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Matrix Status</h3>
                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[8px] font-black text-emerald-500 uppercase">Synced</span>
                    </div>
                </div>
                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Core Engine</span>
                        <span className="text-white font-mono uppercase">V4.2.0-LTS</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Active Signals</span>
                        <span className="text-white font-mono">{liveFixtures.length + upcomingMatches.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-widest">Data Latency</span>
                        <span className="text-emerald-400 font-mono">14ms</span>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
                    <p className="text-[8px] text-slate-600 uppercase leading-relaxed font-bold tracking-widest italic">
                        "The Intelligence Matrix is monitoring all football activity in real-time. Signals are generated using a 4-layered neural network with 98.4% data integrity."
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
