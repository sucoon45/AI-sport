"use client"

import React, { useState, useEffect } from 'react'
import {
    Search,
    Calendar,
    Zap,
    Activity,
    Target,
    BarChart3
} from 'lucide-react'
import MatchCard from '@/components/MatchCard'

interface MatchData {
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: string;
    isVIP?: boolean;
    prediction: {
        type: string;
        probability: number;
        odds: number;
        overUnder?: string;
        signal?: string;
    };
}

export default function PredictionsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [matches, setMatches] = useState<MatchData[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [userTier, setUserTier] = useState('FREE')

    const fetchData = async () => {
        try {
            setLoading(true)
            
            // Fetch User for Tier Check
            const userRes = await fetch('/api/user/wallet')
            const userData = await userRes.json()
            setUserTier(userData.tier || 'FREE')

            const fixturesRes = await fetch('/api/fixtures')
            const fixturesData = await fixturesRes.json()

            if (Array.isArray(fixturesData)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transformed: MatchData[] = fixturesData.map((f: any) => ({
                    id: f.fixtureId.toString(),
                    homeTeam: f.homeTeam,
                    awayTeam: f.awayTeam,
                    league: f.league,
                    startTime: f.startTime,
                    prediction: f.prediction,
                    isVIP: f.isVIP
                }))
                setMatches(transformed)
            }
        } catch (err) {
            console.error('Failed to orbit sync:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredMatches = matches.filter(m => {
        const matchesSearch = m.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.league.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'high') return matchesSearch && m.prediction.probability >= 0.75;
        if (filter === 'value') return matchesSearch && m.prediction.odds >= 2.0;
        return matchesSearch;
    })

    return (
        <div className="flex flex-col gap-8 pb-20 max-w-[1400px] mx-auto px-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Match <span className="gradient-text italic">Radar</span></h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural Network Prediction Feeds</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Scan by team or league..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-slate-600 backdrop-blur-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Sub-Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-2.5 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    {[
                        { id: 'all', label: 'All Clusters', icon: BarChart3 },
                        { id: 'high', label: 'High Confidence', icon: Target },
                        { id: 'value', label: 'Arbitrage Value', icon: Zap }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === item.id
                                    ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 px-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeframe: 24H</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Nodes: 42</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-card h-[420px] animate-pulse rounded-3xl" />
                    ))
                ) : filteredMatches.length > 0 ? (
                    filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} userTier={userTier} />
                    ))
                ) : (
                    <div className="col-span-full py-40 glass-card text-center relative overflow-hidden flex flex-col items-center justify-center gap-6">
                        <div className="absolute inset-0 bg-white/[0.01] scanline" />
                        <Activity className="w-16 h-16 text-slate-800" />
                        <div className="space-y-2">
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Signal Loss Detected</p>
                            <p className="text-slate-600 font-medium text-sm">No matches found matching the specified neural parameters.</p>
                        </div>
                        <button
                            onClick={() => { setFilter('all'); setSearchTerm(''); }}
                            className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                        >
                            Reset Matrix
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ')
}
