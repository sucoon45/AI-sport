"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Trophy,
    History,
    TrendingUp,
    Settings,
    Zap,
    ChevronRight,
    Search,
    Wallet,
    Target
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Predictions', href: '/predictions', icon: Zap },
    { name: 'Auto Bet', href: '/autobet', icon: Target },
    { name: 'Odds Scanner', href: '/odds', icon: Search },
    { name: 'Bet History', href: '/history', icon: History },
    { name: 'Bankroll', href: '/wallet', icon: Wallet },
    { name: 'Settings', href: '/admin', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [balance, setBalance] = React.useState<number | null>(null)

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

    return (
        <aside className="w-[280px] bg-[#020617]/80 backdrop-blur-2xl border-r border-white/[0.05] flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">SportAI</h1>
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Master Engine</span>
                    </div>
                </div>
            </div>

            <div className="px-6 mb-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search fixtures..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all"
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <item.icon className={cn(
                                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                <span className={cn("font-medium text-sm", isActive && "font-semibold")}>{item.name}</span>
                            </div>
                            {isActive && (
                                <>
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                                </>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 mt-auto">
                <Link href="/wallet" className="block">
                    <div className="glass-card !p-5 border-emerald-500/10 bg-emerald-500/[0.02] relative overflow-hidden group hover:bg-emerald-500/[0.05] transition-all cursor-pointer">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] rounded-full -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Vault</span>
                                <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce-slow" />
                            </div>
                            <div className="text-2xl font-bold text-white tracking-tight mb-1">
                                {balance !== null ? `₦${balance.toLocaleString()}` : 'Syncing...'}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-full">
                                    LIVE
                                </span>
                                <span className="text-[10px] font-medium text-slate-500">Asset Balance</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </aside>
    )
}
