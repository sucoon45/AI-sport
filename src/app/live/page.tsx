"use client"

import React, { useState, useEffect } from 'react'
import {
    Trophy,
    Activity,
    Zap,
    Timer,
    AlertCircle,
    RefreshCw,
    ArrowUpRight
} from 'lucide-react'

interface LiveMatch {
    id: string;
    fixtureId: number;
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: string;
    prediction: {
        type: string;
        probability: number;
        odds: number;
    };
    eventDate: string;
}

export default function LiveScoresPage() {
    const [matches, setMatches] = useState<LiveMatch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [executing, setExecuting] = useState<Record<string, boolean>>({})

    const fetchLiveData = async () => {
        try {
            setLoading(true)
            setError(null)
            const fixturesRes = await fetch('/api/fixtures')
            const fixturesData = await fixturesRes.json()
            setMatches(fixturesData)
            setLastUpdated(new Date())
        } catch (err) {
            console.error(err)
            setError("Failed to synchronize with Live Transmission Layer.")
        } finally {
            setLoading(false)
        }
    }

    const handleExecute = async (match: LiveMatch) => {
        setExecuting(prev => ({ ...prev, [match.id]: true }))
        try {
            await fetch('/api/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchText: `${match.homeTeam} vs ${match.awayTeam}`,
                    type: match.prediction.type,
                    odds: match.prediction.odds,
                    stake: 500, // High-freq default
                    currency: 'NGN'
                })
            })
            setTimeout(() => {
                setExecuting(prev => ({ ...prev, [match.id]: false }))
            }, 1000)
        } catch (e) {
            setExecuting(prev => ({ ...prev, [match.id]: false }))
        }
    }

    useEffect(() => {
        fetchLiveData()
        const interval = setInterval(fetchLiveData, 30000) // Refresh every 30s
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Feed Active</span>
                        </div>
                        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Buffer: 4ms</span>
                    </div>
                    <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">
                        Live <span className="text-rose-500">Telemetry</span>
                    </h1>
                    <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
                        Real-time match data streams processed via neural arbitrage engine.
                        Direct fiber connection to global sporting event hubs.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded-[2rem] backdrop-blur-md">
                    <div className="px-6 py-3 flex items-center gap-3">
                        <Timer className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-black text-slate-400 tabular-nums uppercase tracking-widest">Sync: <span className="text-white">{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></span>
                    </div>
                    <button
                        onClick={fetchLiveData}
                        className="p-4 rounded-[1.5rem] bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-white/10 transition-all group"
                    >
                        <RefreshCw className={cn("w-5 h-5 transition-transform duration-700 group-hover:rotate-180", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="glass-card border-rose-500/20 bg-rose-500/5 flex items-center gap-4 p-6 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <p className="text-sm font-bold text-rose-200">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {loading && matches.length === 0 ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-card h-40 animate-pulse bg-white/5 rounded-[2rem]" />
                    ))
                ) : matches.length > 0 ? (
                    matches.map((match) => {
                        const momentumValue = Math.round((match.prediction?.probability || 0.5) * 100);
                        const hasSignal = momentumValue >= 70;
                        const signalType = momentumValue >= 85 ? 'CRITICAL SIGNAL' : (momentumValue >= 70 ? 'HIGH MOMENTUM' : 'STABLE');

                        return (
                            <div key={match.id} className="glass-card group flex flex-col lg:flex-row lg:items-center gap-10 border-white/[0.03] hover:border-emerald-500/20 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/[0.01] scanline opacity-20" />

                                <div className="flex flex-col gap-2 min-w-[200px] relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">{match.league}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
                                        <span className="text-xl font-black text-white tabular-nums">
                                            {match.startTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-between gap-10 px-4 relative z-10">
                                    <div className="flex-1 flex items-center justify-end gap-6 text-right">
                                        <span className="text-2xl font-black text-white tracking-tight">{match.homeTeam}</span>
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 p-3 group-hover:scale-110 transition-transform duration-500">
                                            <Trophy className="w-full h-full text-slate-700" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-6 px-10 py-5 bg-slate-950/80 border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-3xl tabular-nums">
                                            <span className="text-5xl font-black text-emerald-400 tabular-nums">0</span>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-slate-800 font-black text-2xl">VS</span>
                                                <div className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                                            </div>
                                            <span className="text-5xl font-black text-white tabular-nums">0</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex items-center justify-start gap-6 text-left">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 p-3 group-hover:scale-110 transition-transform duration-500">
                                            <Trophy className="w-full h-full text-slate-700" />
                                        </div>
                                        <span className="text-2xl font-black text-white tracking-tight">{match.awayTeam}</span>
                                    </div>
                                </div>

                                <div className="lg:w-[350px] p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col gap-5 relative overflow-hidden group/box hover:bg-white/[0.04] transition-all duration-500 z-10">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-xl ${hasSignal ? 'bg-emerald-500/10' : 'bg-slate-800/10'}`}>
                                                <Zap className={cn("w-4 h-4", hasSignal ? "text-emerald-400 fill-emerald-400" : "text-slate-600")} />
                                            </div>
                                            <span className={cn("text-[10px] font-black tracking-widest uppercase", hasSignal ? "text-emerald-400" : "text-slate-500")}>{signalType}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/5">
                                            <span className="text-[10px] font-black text-slate-500 tabular-nums">{momentumValue}%</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Momentum</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                        <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${momentumValue}%` }} />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => hasSignal && handleExecute(match)}
                                        disabled={!hasSignal || executing[match.id]}
                                        className={cn("w-full py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2", hasSignal ? "bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20 hover:scale-[1.02]" : "bg-white/5 text-slate-600 cursor-not-allowed")}
                                    >
                                        {executing[match.id] ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : hasSignal ? (
                                            'Execute High-Freq Trade'
                                        ) : (
                                            'Matrix Scanning...'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="glass-card flex flex-col items-center justify-center py-32 border-dashed border-white/10 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/[0.01] scanline" />
                        <Activity className="w-16 h-16 text-slate-800 mb-6 opacity-40" />
                        <p className="text-slate-500 font-extrabold uppercase tracking-[0.3em] text-[10px] mb-2">Signal Silence</p>
                        <p className="text-slate-600 text-xs font-medium max-w-xs text-center">No active transmissions detected on the primary frequency. Grid monitoring continues.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ')
}
