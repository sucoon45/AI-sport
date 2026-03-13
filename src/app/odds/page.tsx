"use client"

import React, { useState } from 'react'
import { 
    Search, 
    TrendingUp, 
    ArrowUpRight, 
    Activity,
    ExternalLink
} from 'lucide-react'

const sportsLeagues = ['All Leagues', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']

const scannerData = [
    {
        id: 1,
        match: 'Arsenal vs Chelsea',
        league: 'Premier League',
        time: 'Today, 20:00',
        outcomes: [
            { bookie: 'SportyBet', odds: [1.90, 3.40, 4.20], best: false },
            { bookie: 'Bet9ja', odds: [1.85, 3.50, 4.10], best: false },
            { bookie: 'BetKing', odds: [2.00, 3.30, 3.95], best: true },
            { bookie: '1xBet', odds: [1.95, 3.45, 4.25], best: false },
        ]
    },
    {
        id: 2,
        match: 'Real Madrid vs Atletico',
        league: 'La Liga',
        time: 'Today, 21:00',
        outcomes: [
            { bookie: 'SportyBet', odds: [2.10, 3.20, 3.60], best: false },
            { bookie: 'Bet9ja', odds: [2.15, 3.30, 3.55], best: true },
            { bookie: 'BetKing', odds: [2.05, 3.15, 3.65], best: false },
            { bookie: '1xBet', odds: [2.12, 3.25, 3.58], best: false },
        ]
    },
    {
        id: 3,
        match: 'AC Milan vs Inter Milan',
        league: 'Serie A',
        time: 'Tomorrow, 18:00',
        outcomes: [
            { bookie: 'SportyBet', odds: [2.40, 3.10, 3.10], best: false },
            { bookie: 'Bet9ja', odds: [2.35, 3.15, 3.20], best: false },
            { bookie: 'BetKing', odds: [2.45, 3.05, 3.05], best: true },
            { bookie: '1xBet', odds: [2.42, 3.12, 3.15], best: false },
        ]
    }
]

export default function OddsScannerPage() {
    const [selectedLeague, setSelectedLeague] = useState('All Leagues')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredScannerData = scannerData.filter(data => {
        const matchesSearch = data.match.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             data.league.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLeague = selectedLeague === 'All Leagues' || data.league === selectedLeague;
        return matchesSearch && matchesLeague;
    })

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Odds <span className="gradient-text italic">Scanner</span></h1>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">High-Frequency Arbitrage Detection</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
                        <input 
                            type="text" 
                            placeholder="Find value nodes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/30 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {sportsLeagues.map((league) => (
                    <button 
                        key={league}
                        onClick={() => setSelectedLeague(league)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                            selectedLeague === league 
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                    >
                        {league}
                    </button>
                ))}
            </div>

            {/* Scanner Grid */}
            <div className="space-y-6">
                {filteredScannerData.length > 0 ? filteredScannerData.map((data) => (
                    <div key={data.id} className="glass-card !p-0 overflow-hidden group border-white/[0.03] hover:border-cyan-500/20 transition-all duration-500">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{data.match}</h3>
                                    <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                        <span>{data.league}</span>
                                        <span>•</span>
                                        <span>{data.time}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-5 gap-4 mb-4 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                <span className="col-span-1">Bookmaker Node</span>
                                <span className="text-center">Home (1)</span>
                                <span className="text-center">Draw (X)</span>
                                <span className="text-center">Away (2)</span>
                                <span className="text-right">Action</span>
                            </div>

                            <div className="space-y-2">
                                {data.outcomes.map((outcome, i) => (
                                    <div key={i} className={`grid grid-cols-5 gap-4 p-4 rounded-2xl items-center transition-all ${outcome.best ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02] border border-transparent'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-950/50 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white/5">
                                                {outcome.bookie.substring(0, 1)}
                                            </div>
                                            <span className="text-xs font-black text-white">{outcome.bookie}</span>
                                        </div>
                                        {outcome.odds.map((odd, idx) => (
                                            <span key={idx} className="text-sm font-black text-center text-white tabular-nums">
                                                {odd.toFixed(2)}
                                            </span>
                                        ))}
                                        <div className="flex justify-end">
                                            <button className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                                                outcome.best 
                                                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}>
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-cyan-500/[0.02] border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                                    Scanning 1,420 arbitrage nodes... Optimal value detected at <span className="text-cyan-400">BetKing</span> (+4.2% yield)
                                </span>
                            </div>
                            <button className="text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2 group">
                                Deep Analysis <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="glass-card flex flex-col items-center justify-center py-32 border-dashed border-white/10 rounded-[3rem] relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/[0.01] scanline" />
                        <Activity className="w-16 h-16 text-slate-800 mb-6 opacity-40" />
                        <p className="text-slate-500 font-extrabold uppercase tracking-[0.3em] text-[10px] mb-2">No Arbitrage Nodes</p>
                        <p className="text-slate-600 text-xs font-medium max-w-xs text-center">No value opportunities detected matching your current filters. Scanning continues...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
