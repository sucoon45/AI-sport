"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function Header() {
    const router = useRouter();
    const [connecting, setConnecting] = useState(false);
    const [balance, setBalance] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch('/api/user/wallet')
                const data = await res.json()
                setBalance(data.balanceNaira)
            } catch (e) {}
        }
        fetchBalance()
        const interval = setInterval(fetchBalance, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = async () => {
        setConnecting(true);
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' })
            });
            router.push('/login');
            router.refresh();
        } catch (e) {
            console.error('Logout failed');
            setConnecting(false);
        }
    }

    return (
        <header className="h-24 border-b border-white/[0.03] bg-transparent backdrop-blur-md sticky top-0 z-40 px-12 flex items-center justify-between">
            <div className="flex flex-col">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Authenticated Access</h2>
                <span className="text-sm font-black text-white">Console [Kamirex]</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-6 py-2.5 rounded-2xl backdrop-blur-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Node Sync: Optimal</span>
                </div>

                {balance !== null && (
                    <div className="flex items-center gap-2 group cursor-pointer bg-white/[0.03] border border-white/5 px-6 py-2.5 rounded-2xl hover:bg-white/10 transition-all">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vault:</span>
                        <span className="text-xs font-black text-white">₦{balance.toLocaleString()}</span>
                    </div>
                )}
                
                <button
                    onClick={handleLogout}
                    disabled={connecting}
                    className="bg-white/5 hover:bg-rose-500 hover:text-white border border-white/10 text-slate-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-80 flex items-center gap-2"
                >
                    {connecting ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                        <>
                            <LogOut className="w-3 h-3" />
                            Terminate Session
                        </>
                    )}
                </button>
            </div>
        </header>
    )
}
