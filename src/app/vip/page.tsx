"use client"

import React, { useState, useEffect } from 'react'
import { Crown, Lock, Zap, ShieldCheck, Sparkles, CreditCard, CheckCircle2, ArrowRight, Star } from 'lucide-react'
import MatchCard from '@/components/MatchCard'

const PLANS = [
    {
        id: 'VIP',
        name: 'VIP Daily',
        price: '₦2,500',
        period: '/ day',
        color: 'amber',
        glow: 'rgba(245,158,11,0.3)',
        features: [
            'All VIP Signals for 24 hours',
            'High-confidence (>88%) predictions',
            'BTTS & Correct Score analytics',
            'Priority signal delivery',
        ],
    },
    {
        id: 'MONTHLY',
        name: 'Monthly Premium',
        price: '₦15,000',
        period: '/ month',
        color: 'cyan',
        glow: 'rgba(6,182,212,0.3)',
        popular: true,
        features: [
            'All VIP features for 30 days',
            'Unlimited signal access',
            'AutoBet strategy integration',
            'Early match alerts',
            'Priority customer support',
        ],
    },
]

export default function VIPPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [vipMatches, setVipMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [userTier, setUserTier] = useState('FREE')
    const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null)
    const [upgrading, setUpgrading] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch subscription status
                const subRes = await fetch('/api/subscriptions')
                if (subRes.ok) {
                    const subData = await subRes.json()
                    if (subData && !subData.error) {
                        setUserTier(subData.tier || 'FREE')
                        if (subData.subscriptionExpiry) {
                            setSubscriptionExpiry(new Date(subData.subscriptionExpiry).toLocaleDateString())
                        }
                    }
                }

                // Fetch VIP fixtures
                const fixRes = await fetch('/api/fixtures')
                const fixData = await fixRes.json()
                if (Array.isArray(fixData)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vip = fixData.filter((f: any) => f.isVIP)
                    setVipMatches(vip)
                }
            } catch (e) {
                console.error('Failed to load VIP data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleUpgrade = async (plan: string) => {
        setUpgrading(plan)
        try {
            const res = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            })
            const data = await res.json()
            if (data.authorizationUrl) {
                window.location.href = data.authorizationUrl
            } else {
                alert(data.error || 'Payment initialization failed')
            }
        } catch (e) {
            alert('Network error. Please try again.')
        } finally {
            setUpgrading(null)
        }
    }

    const isSubscribed = userTier !== 'FREE'

    return (
        <div className="flex flex-col gap-12 pb-20 max-w-[1400px] mx-auto px-4">
            {/* ── Hero Header ── */}
            <div className="relative pt-10">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-[3rem] pointer-events-none" />
                <div className="flex flex-col items-center text-center gap-6 py-16 relative z-10">
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-6 py-2.5 rounded-full">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">
                            {isSubscribed ? `${userTier} Access • Expires ${subscriptionExpiry}` : 'Premium Intelligence Network'}
                        </span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
                        Scouter{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                            VIP
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed">
                        Access our highest-confidence neural signals — predictions generated when the AI engine
                        detects an edge of <span className="text-amber-400 font-bold">&gt;88% certainty</span>. Only available to premium subscribers.
                    </p>

                    {isSubscribed && (
                        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">
                                Active — Full VIP Access Granted
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── VIP Signals Grid ── */}
            {isSubscribed ? (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-black text-white uppercase tracking-widest">
                            Today&apos;s VIP Signals
                        </h2>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/30 to-transparent" />
                        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase">
                            {vipMatches.length} Active
                        </span>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="glass-card h-[420px] animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : vipMatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {vipMatches.map((match) => (
                                <MatchCard key={match._id} match={{ ...match, id: match.fixtureId }} userTier={userTier} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card flex flex-col items-center justify-center py-32 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/[0.01] scanline" />
                            <Star className="w-16 h-16 text-amber-900 mb-6 opacity-40" />
                            <p className="text-slate-500 font-extrabold uppercase tracking-[0.3em] text-[10px] mb-2">
                                No VIP Signals Yet
                            </p>
                            <p className="text-slate-600 text-xs font-medium max-w-xs">
                                The AI engine hasn&apos;t generated any ultra-high-confidence signals for today&apos;s fixtures. Check back soon.
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                /* ── Pricing Plans ── */
                <div className="flex flex-col gap-10">
                    {/* Locked preview */}
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 blur-sm grayscale opacity-30 pointer-events-none select-none">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="glass-card h-[260px] rounded-3xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/[0.01] scanline" />
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-16 h-16 rounded-3xl bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-slate-950" />
                                </div>
                                <p className="text-lg font-black text-white uppercase tracking-wide">
                                    Subscribe to Unlock VIP Signals
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`glass-card relative overflow-hidden flex flex-col gap-6 p-8 border-${plan.color}-500/20 bg-${plan.color}-500/[0.02] transition-all hover:border-${plan.color}-500/40`}
                                style={{ boxShadow: plan.popular ? `0 0 60px ${plan.glow}` : undefined }}
                            >
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-cyan-500 px-3 py-1.5 rounded-xl">
                                        <Sparkles className="w-3 h-3 text-slate-950" />
                                        <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Best Value</span>
                                    </div>
                                )}

                                <div className={`w-12 h-12 rounded-2xl bg-${plan.color}-500/20 border border-${plan.color}-500/30 flex items-center justify-center`}>
                                    <Crown className={`w-6 h-6 text-${plan.color}-400`} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-4xl font-black text-${plan.color}-400 tracking-tighter`}>{plan.price}</span>
                                        <span className="text-slate-500 text-xs font-bold mb-1.5">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="flex flex-col gap-3">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <ShieldCheck className={`w-4 h-4 text-${plan.color}-500 flex-shrink-0`} />
                                            <span className="text-xs font-medium text-slate-300">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={upgrading === plan.id}
                                    className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                        plan.color === 'amber'
                                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                                    } disabled:opacity-50 disabled:cursor-wait`}
                                >
                                    {upgrading === plan.id ? (
                                        <CreditCard className="w-4 h-4 animate-pulse" />
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            Activate {plan.name}
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
