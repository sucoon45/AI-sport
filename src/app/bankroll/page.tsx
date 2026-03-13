"use client"

import React, { useState, useEffect } from 'react'
import { 
    Wallet, 
    TrendingUp, 
    ArrowUpRight, 
    ShieldCheck,
    ChevronRight,
    PieChart,
    Sliders
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

const accuracyData = [
    { name: 'Jan', value: 72 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 65 },
    { name: 'Apr', value: 82 },
    { name: 'May', value: 79 },
    { name: 'Jun', value: 74 },
    { name: 'Jul', value: 68 },
    { name: 'Aug', value: 85 },
    { name: 'Sep', value: 81 },
    { name: 'Oct', value: 77 },
    { name: 'Nov', value: 88 },
    { name: 'Dec', value: 84 },
]

export default function BankrollPage() {
    const [maxBet, setMaxBet] = useState(2)
    const [riskLevel, setRiskLevel] = useState('Medium')
    const [balance, setBalance] = useState(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bets, setBets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletRes = await fetch('/api/user/wallet')
                const walletData = await walletRes.json()
                if (walletData && typeof walletData.balanceNaira === 'number') {
                    setBalance(walletData.balanceNaira)
                }

                const betsRes = await fetch('/api/bets')
                const betsData = await betsRes.json()
                if (Array.isArray(betsData)) {
                    setBets(betsData)
                }
            } catch (e) {
                console.error('Failed to sync financial matrix')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synchronizing Financial Matrix...</p>
                </div>
            </div>
        )
    }

    const wonBets = Array.isArray(bets) ? bets.filter(b => b.result === 'WON') : []
    const accuracy = Array.isArray(bets) && bets.length > 0 ? Math.round((wonBets.length / bets.length) * 100) : 0
    const totalYield = Array.isArray(bets) ? bets.reduce((acc, bet) => {
        const stake = bet.currency === 'NGN' ? bet.stake : bet.stake * 1500;
        const payout = bet.payout || 0; // payout might be undefined for pending
        if (bet.result === 'WON') return acc + (payout - stake);
        if (bet.result === 'LOST') return acc - stake;
        return acc;
    }, 0) : 0;

    const statsGrid = [
        { label: 'Total Bankroll', value: `₦${(balance || 0).toLocaleString()}`, change: 'LIVE', icon: Wallet, color: 'cyan' },
        { label: 'Yield Volume', value: `₦${(totalYield || 0).toLocaleString()}`, change: (totalYield || 0) >= 0 ? 'GAINING' : 'DEFICIT', icon: TrendingUp, color: 'emerald' },
        { label: "Signal Accuracy", value: `${accuracy}%`, change: 'Optimal', icon: ArrowUpRight, color: 'emerald' },
        { label: 'Risk Level', value: riskLevel, change: 'Stable', icon: ShieldCheck, color: 'purple' },
    ]

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col gap-6 pt-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-cyan-500 shadow-[0_10px_30px_rgba(6,182,212,0.3)] text-slate-950">
                        <Wallet className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Financial <span className="gradient-text italic">Matrix</span></h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Bankroll Management & Risk Allocation</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsGrid.map((item, i) => (
                    <div key={i} className="glass-card group hover-lift relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${item.color === 'cyan' ? '[#00f7ff]' : (item.color === 'emerald' ? 'emerald-500' : 'purple-500')}/10 blur-[40px] rounded-full -mr-10 -mt-10`} />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest", item.color === 'emerald' ? "text-emerald-400 bg-emerald-500/10" : "text-cyan-400 bg-cyan-500/10")}>
                                {item.change}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <h3 className="text-2xl font-black text-white tracking-tight">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Prediction Accuracy Chart */}
            <div className="glass-card !p-10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyan-500/[0.01] scanline opacity-20" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-1">Prediction Accuracy</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Live matrix precision tracking</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400">+12% THIS MONTH</span>
                    </div>
                </div>

                <div className="h-[350px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={accuracyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#334155" 
                                fontSize={10} 
                                fontWeight={800} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                contentStyle={{ 
                                    backgroundColor: '#0a0a0b', 
                                    borderRadius: '20px', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '12px'
                                }}
                            />
                            <Bar dataKey="value" radius={[10, 10, 5, 5]}>
                                {accuracyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === accuracyData.length - 1 ? '#00f7ff' : '#00f7ff33'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Risk Management Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card flex flex-col gap-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                            <Sliders className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Risk <span className="text-slate-500">Parameters</span></h3>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Max bet per match</label>
                                <span className="text-sm font-black text-cyan-400 tabular-nums">{maxBet}% of bankroll</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                value={maxBet}
                                onChange={(e) => setMaxBet(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
                            />
                            <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest">
                                <span>Conservative</span>
                                <span>Aggressive</span>
                            </div>
                            <p className="text-[10px] text-slate-600 font-medium italic">Current: ₦{(245000 * maxBet / 100).toLocaleString()}</p>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Risk Strategy</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <button 
                                        key={level}
                                        onClick={() => setRiskLevel(level)}
                                        className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            riskLevel === level 
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                Insights <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase italic mb-4">Capital <span className="text-slate-500">Distribution</span></h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Main Pool', value: '75%', color: 'emerald' },
                                { name: 'Risk Reserves', value: '15%', color: 'rose' },
                                { name: 'Liquid Assets', value: '10%', color: 'cyan' },
                            ].map((pool, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full bg-${pool.color}-500`} />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pool.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-white tabular-nums">{pool.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button className="mt-8 w-full bg-white text-slate-950 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all active:scale-95">
                        Optimize Allocation Hub
                    </button>
                </div>
            </div>
        </div>
    )
}
