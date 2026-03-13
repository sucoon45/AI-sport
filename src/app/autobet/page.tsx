"use client"

import React, { useState } from 'react'
import { 
    Zap, 
    Play, 
    Pause, 
    ShieldCheck, 
    Target, 
    TrendingUp, 
    AlertCircle,
    Activity,
    ChevronRight,
    Settings2
} from 'lucide-react'

const strategies = [
    {
        id: 'high-conf',
        name: 'High Confidence Only',
        description: 'Auto-bet on predictions with 70%+ confidence score.',
        stats: { bets: 0, winRate: '0%' },
        active: false,
        icon: ShieldCheck,
        color: 'emerald'
    },
    {
        id: 'premier-only',
        name: 'Premier League Focus',
        description: 'Restrict automated execution to English Premier League matches.',
        stats: { bets: 0, winRate: '0%' },
        active: false,
        icon: Target,
        color: 'cyan'
    },
    {
        id: 'over-under',
        name: 'Over 2.5 Strategy',
        description: 'Auto-bet on Over 2.5 goals when probability exceeds 65%.',
        stats: { bets: 0, winRate: '0%' },
        active: false,
        icon: TrendingUp,
        color: 'amber'
    },
    {
        id: 'btts-neural',
        name: 'BTTS Neural Engine',
        description: 'Execute trades on Both Teams to Score based on defensive matrix.',
        stats: { bets: 0, winRate: '0%' },
        active: false,
        icon: Activity,
        color: 'purple'
    }
]

export default function AutoBetPage() {
    const [isBotRunning, setIsBotRunning] = useState(false)
    const [activeStrategies, setActiveStrategies] = useState(strategies.map(s => s.id).filter((_, i) => i % 2 === 0))

    const toggleStrategy = (id: string) => {
        setActiveStrategies(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-[#00f7ff] shadow-[0_0_30px_rgba(0,247,255,0.3)]">
                            <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Neural <span className="gradient-text italic">Matrix</span></h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Autonomous Execution Protocol</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-medium">
                        Engage distributed compute nodes to execute trades based on pre-configured neural parameters. 
                        The engine optimizes for volume and precision.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bot Status</span>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/5">
                            <div className={`w-1.5 h-1.5 rounded-full ${isBotRunning ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isBotRunning ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isBotRunning ? 'Operational' : 'Paused / Idle'}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsBotRunning(!isBotRunning)}
                        className={`group relative overflow-hidden flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                            isBotRunning 
                            ? 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.3)]' 
                            : 'bg-[#00f7ff] text-slate-950 shadow-[0_0_40px_rgba(0,247,255,0.3)] hover:scale-[1.05]'
                        }`}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        {isBotRunning ? <Pause className="w-5 h-5 relative z-10" /> : <Play className="w-5 h-5 relative z-10 fill-slate-950" />}
                        <span className="relative z-10 text-xs">{isBotRunning ? 'Terminate Bot' : 'Ignite System'}</span>
                    </button>
                </div>
            </div>

            {/* Warning / Status Banner */}
            <div className={`flex items-center gap-4 px-10 py-6 rounded-[2.5rem] border border-dashed transition-all duration-700 ${
                isBotRunning 
                ? 'bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-amber-500/5 border-amber-500/20'
            }`}>
                {isBotRunning ? <Activity className="w-6 h-6 text-emerald-500 animate-pulse" /> : <AlertCircle className="w-6 h-6 text-amber-500" />}
                <p className="text-xs font-bold text-slate-400">
                    {isBotRunning 
                        ? 'Matrix Synchronizer alpha-7 is scanning 1,240 match nodes. Automated trades will execute instantly on validated signals.' 
                        : 'System is currently in Simulation Mode. Connect your Primary Vault to enable live automated execution.'
                    }
                </p>
            </div>

            {/* Betting Rules Grid */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase italic">Active <span className="text-slate-500">Inference Rules</span></h3>
                    <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <Settings2 className="w-4 h-4" />
                        Configure Global Parameters
                    </button>
                </div>

                <div className="space-y-4">
                    {strategies.map((strategy) => {
                        const isActive = activeStrategies.includes(strategy.id)
                        return (
                            <div 
                                key={strategy.id} 
                                className={`glass-card !p-8 group flex items-center justify-between gap-10 border-white/[0.03] hover:border-white/[0.08] transition-all duration-500 relative overflow-hidden ${!isActive && 'opacity-60 grayscale-[0.5]'}`}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isActive ? `bg-${strategy.color}-500` : 'bg-slate-800'}`} />
                                <div className="absolute inset-0 bg-white/[0.01] scanline opacity-20" />
                                
                                <div className="flex items-center gap-8 relative z-10 flex-1">
                                    <div className={`p-5 rounded-2xl ${isActive ? `bg-${strategy.color}-500/10 text-${strategy.color}-500 shadow-[0_0_20px_rgba(0,0,0,0.3)]` : 'bg-slate-800/50 text-slate-600'}`}>
                                        <strategy.icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{strategy.name}</h4>
                                        <p className="text-slate-500 text-xs font-medium max-w-lg">{strategy.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 relative z-10">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Executions</span>
                                        <span className="text-sm font-black text-white">{strategy.stats.bets} Trades</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Win Rate</span>
                                        <span className={`text-sm font-black text-${strategy.color}-400`}>{strategy.stats.winRate}</span>
                                    </div>

                                    <button 
                                        onClick={() => toggleStrategy(strategy.id)}
                                        className={`relative w-14 h-8 rounded-full transition-all duration-500 flex items-center px-1.5 ${isActive ? 'bg-emerald-500' : 'bg-slate-800'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-500 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Performance Footer */}
            <div className="mt-10 glass-card !p-12 border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-emerald-500/20 transition-all duration-1000" />
                <div className="relative z-10 max-w-xl">
                    <h3 className="text-2xl font-black text-white tracking-tight mb-3">Upgrade to <span className="gradient-text italic">Pro Matrix</span></h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Unlock high-frequency execution across all 400+ global leagues, private neural servers, and real-time arbitrage detection.
                        Premium members achieve on average 14% higher ROI monthly.
                    </p>
                </div>
                <button className="relative z-10 px-10 py-5 rounded-[2rem] bg-emerald-px-10 font-black text-[10px] uppercase tracking-[0.3em] text-white border border-emerald-500/30 hover:bg-emerald-500/10 transition-all flex items-center gap-3 active:scale-95 group/btn">
                    Access Premium Nodes
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}
