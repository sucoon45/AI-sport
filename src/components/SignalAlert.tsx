"use client"

import React, { useState, useEffect } from 'react'
import { Zap, X, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignalAlert() {
    const [isVisible, setIsVisible] = useState(false);
    const [signal, setSignal] = useState({ match: '', probability: 0, gain: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isVisible) {
                const matches = ['Arsenal vs Liverpool', 'Real Madrid vs Barcelona', 'Man City vs Chelsea', 'Bayern vs PSG'];
                const randomMatch = matches[Math.floor(Math.random() * matches.length)];
                const prob = Math.floor(75 + Math.random() * 20);
                const gain = (1.5 + Math.random() * 1.5).toFixed(2);

                setSignal({ match: randomMatch, probability: prob, gain: parseFloat(gain) });
                setIsVisible(true);

                setTimeout(() => setIsVisible(false), 5000);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.9 }}
                    className="fixed bottom-10 right-10 z-[100] w-80 shadow-2xl"
                >
                    <div className="glass-card !p-0 overflow-hidden border-emerald-500/30 bg-slate-950/90 backdrop-blur-2xl">
                        <div className="absolute inset-0 bg-emerald-500/5 scanline" />
                        <div className="p-5 flex flex-col gap-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <Zap className="w-4 h-4 fill-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Neural Signal</span>
                                </div>
                                <button onClick={() => setIsVisible(false)} className="text-slate-600 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">High Probability Detected</span>
                                <h4 className="text-lg font-black text-white tracking-tight">{signal.match}</h4>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Confidence</span>
                                    <span className="text-sm font-black text-emerald-400">{signal.probability}%</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Est. Yield</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-black text-white">x{signal.gain}</span>
                                        <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all active:scale-95">
                                Lock Transmission
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
