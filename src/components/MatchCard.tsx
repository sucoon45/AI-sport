"use client"

import React, { useState } from 'react'
import { Zap, RefreshCw, CreditCard } from 'lucide-react'

export interface MatchProps {
    id: string
    homeTeam: string
    awayTeam: string
    league: string
    startTime: string
    isVIP?: boolean
    prediction: {
        type: string
        probability: number
        odds: number
        overUnder?: string
        signal?: string
    }
}

export default function MatchCard({ match, userTier = 'FREE' }: { match: MatchProps, userTier?: string }) {
    const [executing, setExecuting] = useState(false);
    const [success, setSuccess] = useState(false);

    const isLocked = match.isVIP && userTier !== 'VIP' && userTier !== 'MONTHLY';

    const handleExecute = async () => {
        setExecuting(true);
        try {
            await fetch('/api/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    matchText: `${match.homeTeam} vs ${match.awayTeam}`,
                    type: match.prediction.type,
                    odds: match.prediction.odds,
                    stake: 1000,
                    currency: 'NGN'
                })
            });
            setTimeout(() => {
                setExecuting(false);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }, 800);
        } catch (error) {
            setExecuting(false);
        }
    }

    // Heuristic for sub-probabilities (since our model currently only does 1X2)
    const probHome = Math.round(match.prediction.probability * 100);
    const probDraw = Math.round((100 - probHome) * 0.6);
    const probAway = 100 - probHome - probDraw;

    // Deterministic pseudo-randomness based on match ID for sub-probabilities
    const getSeed = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const seed = getSeed(match.id);
    const overProb = 50 + (seed % 35);
    const bttsProb = 40 + ((seed * 7) % 45);

    return (
        <div className="glass-card flex flex-col gap-8 overflow-hidden relative group hover-lift">
            <div className="absolute inset-0 bg-white/[0.01] scanline opacity-20" />
            
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{match.league}</span>
                    {match.isVIP && (
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                            <span className="text-[8px] font-black text-amber-500 uppercase">VIP</span>
                        </div>
                    )}
                </div>
                <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1 rounded-full">{match.startTime}</span>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-cyan-400 shadow-xl group-hover:scale-110 transition-transform duration-500">
                        {match.homeTeam.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm font-black text-white">{match.homeTeam}</span>
                </div>
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-emerald-400 shadow-xl group-hover:scale-110 transition-transform duration-500">
                        {match.awayTeam.substring(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm font-black text-white">{match.awayTeam}</span>
                </div>
                <div className="absolute left-1/2 top-8 -translate-x-1/2 text-slate-800 font-black italic text-2xl opacity-20">VS</div>
            </div>

            <div className={cn("grid grid-cols-3 gap-2 relative z-10 transition-all duration-700", isLocked ? "blur-sm grayscale opacity-30 select-none pointer-events-none" : "")}>
                {[
                    { label: 'HOME', prob: probHome, color: 'cyan' },
                    { label: 'DRAW', prob: probDraw, color: 'slate' },
                    { label: 'AWAY', prob: probAway, color: 'emerald' }
                ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-black text-slate-600 tracking-tighter">{item.label}</span>
                            <span className={`text-[10px] font-black text-${item.color}-400`}>{item.prob}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-${item.color}-500/80`} style={{ width: `${item.prob}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            {isLocked && (
                <div className="absolute inset-x-0 bottom-[120px] flex flex-col items-center justify-center z-20 gap-3 px-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center text-slate-950">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">VIP Node Locked</p>
                        <p className="text-xs font-bold text-slate-400">Upgrade to Scouter VIP to unlock high-confidence neural signals.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">O/U 2.5</span>
                    <span className="text-xs font-black text-white">O {overProb}% | U {100-overProb}%</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">BTTS</span>
                    <span className="text-xs font-black text-white">Y {bttsProb}% | N {100-bttsProb}%</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Recommended</span>
                    <span className={cn("text-sm font-black italic uppercase tracking-tight transition-all", isLocked ? "text-slate-700 blur-[2px]" : "text-emerald-400")}>
                        {isLocked ? "XXXXXXXXXXXX" : match.prediction.type}
                    </span>
                </div>
                {isLocked ? (
                    <button 
                        className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.05]"
                        onClick={() => window.location.href = '/wallet'}
                    >
                        Unlock Signal
                    </button>
                ) : (
                    <button 
                        onClick={handleExecute}
                        disabled={executing || success}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                            success 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : 'bg-[#00f7ff] text-slate-950 shadow-[0_0_20px_rgba(0,247,255,0.2)] hover:scale-[1.05]'
                        }`}
                    >
                        {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : (success ? 'Confirmed' : 'Execute')}
                    </button>
                )}
            </div>
        </div>
    )
}

function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(' ')
}
