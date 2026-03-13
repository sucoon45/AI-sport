"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function CallbackContent() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying transaction...')
    const [newBalance, setNewBalance] = useState<number | null>(null)

    useEffect(() => {
        const verify = async () => {
            const reference = searchParams.get('reference')
            if (!reference) {
                setStatus('error')
                setMessage('Missing transaction reference.')
                return
            }

            try {
                const res = await fetch(`/api/user/wallet/deposit/verify?reference=${reference}`)
                const data = await res.json()

                if (data.success) {
                    setStatus('success')
                    setMessage(data.message || 'Vault replenished successfully.')
                    setNewBalance(data.newBalance)
                } else {
                    setStatus('error')
                    setMessage(data.error || 'Transaction verification failed.')
                }
            } catch (e) {
                setStatus('error')
                setMessage('An error occurred during verification.')
            }
        }

        verify()
    }, [searchParams])

    return (
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
            <div className="max-w-md w-full glass-card !p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/[0.02] scanline opacity-30" />
                
                <div className="relative z-10 flex flex-col items-center gap-8">
                    {status === 'loading' && (
                        <>
                            <div className="relative">
                                <div className="w-20 h-20 border-2 border-cyan-500/20 rounded-full animate-spin border-t-cyan-500" />
                                <Loader2 className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Verifying <span className="text-cyan-500">Nodes</span></h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{message}</p>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Replenishment <span className="text-emerald-500">Complete</span></h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">{message}</p>
                                
                                {newBalance !== null && (
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">New Vault Balance</p>
                                        <p className="text-2xl font-black text-white">₦{newBalance.toLocaleString()}</p>
                                    </div>
                                )}

                                <Link 
                                    href="/wallet"
                                    className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all active:scale-95"
                                >
                                    Return to Console <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.1)]">
                                <XCircle className="w-12 h-12" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Protocol <span className="text-rose-500">Failure</span></h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">{message}</p>
                                
                                <Link 
                                    href="/wallet"
                                    className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                                >
                                    Try Again
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function WalletCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-cyan-500">Initializing...</div>}>
            <CallbackContent />
        </Suspense>
    )
}
