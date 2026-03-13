"use client"

import React, { useState, useEffect } from 'react'
import {
    ShieldCheck,
    Search,
    History,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Filter
} from 'lucide-react'

export default function HistoryPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [bets, setBets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/bets');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBets(data);
                } else if (data.error === 'Unauthorized') {
                    window.location.href = '/login';
                }
            } catch (e) {
                console.error('Failed to load bet history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredBets = Array.isArray(bets) ? bets.filter(bet => 
        (bet.matchText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bet.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (bet.result || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const totalVolume = filteredBets.reduce((acc, bet) => acc + (bet.currency === 'NGN' ? bet.stake : bet.stake * 1500), 0);
    const wonBets = filteredBets.filter(b => b.result === 'WON');
    const winRate = filteredBets.length > 0 ? ((wonBets.length / filteredBets.length) * 100).toFixed(1) : '0.0';
    const totalYield = filteredBets.reduce((acc, bet) => {
        const stake = bet.currency === 'NGN' ? bet.stake : bet.stake * 1500;
        const payout = bet.currency === 'NGN' ? bet.payout : bet.payout * 1500;
        if (bet.result === 'WON') return acc + (payout - stake);
        if (bet.result === 'LOST') return acc - stake;
        return acc;
    }, 0);

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            <div className="flex flex-col gap-6 pt-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-cyan-500 shadow-[0_10px_30px_rgba(6,182,212,0.3)] text-slate-950">
                        <History className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Ledger <span className="gradient-text italic">Archive</span></h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Immutable Execution Records</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter execution logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2rem] pl-16 pr-6 py-5 text-sm text-white focus:outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition-all placeholder:text-slate-600 backdrop-blur-xl"
                        />
                    </div>
                    <button className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all backdrop-blur-xl">
                        <Filter className="w-4 h-4" />
                        <span>Filter Matrix</span>
                    </button>
                </div>
            </div>

            <div className="glass-card !p-0 overflow-hidden border-white/[0.03] bg-white/[0.01] backdrop-blur-3xl rounded-[2.5rem] relative">
                <div className="absolute inset-0 bg-white/[0.01] scanline pointer-events-none" />
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction / Time</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Protocol</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Investment</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Multiplier</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Status</th>
                                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Yield</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-10 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Secure Database...</td>
                                </tr>
                            )}
                            {!loading && filteredBets.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-10 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">No execution records located on the ledger.</td>
                                </tr>
                            )}
                            {!loading && filteredBets.map((bet) => (
                                <tr key={bet._id || bet.id} className="group hover:bg-white/[0.03] transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-base font-black text-white group-hover:text-cyan-400 transition-colors">{bet.matchText}</span>
                                            <span className="text-[10px] text-slate-500 font-bold tabular-nums uppercase tracking-widest">
                                                {new Date(bet.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="text-[10px] font-black text-slate-400 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl uppercase tracking-widest">{bet.type}</span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="text-base font-black text-white tabular-nums">
                                            {bet.currency === 'ETH' ? '' : '₦'}{bet.stake.toFixed(bet.currency === 'ETH' ? 4 : 2)}{bet.currency === 'ETH' ? ' ETH' : ''}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <span className="text-base font-black text-slate-500 tabular-nums">x{bet.odds.toFixed(2)}</span>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className={bet.result === 'WON' ? 'text-emerald-400' : (bet.result === 'PENDING' ? 'text-amber-400' : 'text-rose-500')}>
                                            <div className="flex items-center justify-end gap-2.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest">{bet.result}</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${bet.result === 'WON' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : (bet.result === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]')}`} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {bet.result === 'PENDING' ? (
                                                    <span className="text-base font-black text-slate-600 tabular-nums truncate">EST: {bet.currency === 'ETH' ? '' : '₦'}{(bet.stake * (bet.odds || 1)).toFixed(bet.currency === 'ETH' ? 4 : 2)}{bet.currency === 'ETH' ? ' ETH' : ''}</span>
                                                ) : (
                                                    <>
                                                        <span className={bet.result === 'WON' ? 'text-xl font-black text-emerald-400 tabular-nums' : 'text-base font-black text-slate-600 tabular-nums'}>
                                                            {bet.currency === 'ETH' ? '' : '₦'}{(bet.payout || 0).toFixed(bet.currency === 'ETH' ? 4 : 2)}{bet.currency === 'ETH' ? ' ETH' : ''}
                                                        </span>
                                                        {bet.result === 'WON' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-slate-700" />}
                                                    </>
                                                )}
                                            </div>
                                            {bet.result !== 'PENDING' && (
                                                <span className={`text-[10px] font-black tracking-widest ${bet.result === 'WON' ? 'text-emerald-500/50' : 'text-rose-500/50'}`}>
                                                    {bet.result === 'WON' ? `NET: +${bet.currency === 'ETH' ? '' : '₦'}${(bet.payout - bet.stake).toFixed(bet.currency === 'ETH' ? 4 : 2)}${bet.currency === 'ETH' ? ' ETH' : ''}` : `LOSS: -${bet.currency === 'ETH' ? '' : '₦'}{bet.stake.toFixed(bet.currency === 'ETH' ? 4 : 2)}${bet.currency === 'ETH' ? ' ETH' : ''}`}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {[
                    { label: 'Total Volume', value: `₦${(totalVolume || 0).toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
                    { label: 'Execution Win Rate', value: `${winRate}%`, icon: ShieldCheck, color: 'cyan' },
                    { label: 'Total Yield', value: `${(totalYield || 0) >= 0 ? '+' : '-'}₦${Math.abs(totalYield || 0).toLocaleString()}`, icon: ArrowUpRight, color: 'emerald' }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ].map((stat: any, i) => (
                    <div key={i} className="glass-card flex items-center justify-between p-10 border-white/[0.03]">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
                            <span className="text-3xl font-black text-white tabular-nums">{stat.value}</span>
                        </div>
                        <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
