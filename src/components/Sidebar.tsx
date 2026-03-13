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
    Target,
    BarChart3,
    Crown,
    Bell
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { name: 'Dashboard',       href: '/',               icon: LayoutDashboard },
    { name: 'Predictions',     href: '/predictions',     icon: Zap },
    { name: 'VIP Signals',     href: '/vip',             icon: Crown, vip: true },
    { name: 'Live Scores',     href: '/live',            icon: Trophy },
    { name: 'Auto Bet',        href: '/autobet',         icon: Target },
    { name: 'Odds Scanner',    href: '/odds',            icon: Search },
    { name: 'Bet History',     href: '/history',         icon: History },
    { name: 'Bankroll',        href: '/bankroll',        icon: BarChart3 },
    { name: 'Alerts',          href: '/notifications',   icon: Bell, badge: true },
    { name: 'Vault',           href: '/wallet',          icon: Wallet },
    { name: 'Console',         href: '/admin',           icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [balance, setBalance] = React.useState<number | null>(null)
    const [tier, setTier] = React.useState<string>('FREE')
    const [unreadNotifs, setUnreadNotifs] = React.useState(0)

    React.useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch('/api/user/wallet')
                const data = await res.json()
                setBalance(data.balanceNaira)
                setTier(data.tier || 'FREE')
            } catch (e) {}
        }
        const fetchNotifs = async () => {
            try {
                const res = await fetch('/api/notifications')
                const data = await res.json()
                setUnreadNotifs(data.unreadCount || 0)
            } catch (e) {}
        }
        fetchBalance()
        fetchNotifs()
        const interval = setInterval(() => { fetchBalance(); fetchNotifs(); }, 30000)
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
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Master Engine</span>
                            {tier !== 'FREE' && (
                                <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Crown className="w-2.5 h-2.5" />{tier}
                                </span>
                            )}
                        </div>
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
                                item.vip
                                    ? isActive
                                        ? "bg-amber-500/10 text-white shadow-[0_0_20px_rgba(245,158,11,0.07)]"
                                        : "text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/5 border border-amber-500/10"
                                    : isActive
                                        ? "bg-emerald-500/10 text-white shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                        item.vip
                                            ? isActive ? "text-amber-400" : "text-amber-500/60 group-hover:text-amber-400"
                                            : isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                                    )} />
                                    {item.badge && unreadNotifs > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 rounded-full text-[7px] font-black text-white flex items-center justify-center leading-none shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                                            {unreadNotifs > 9 ? '9+' : unreadNotifs}
                                        </span>
                                    )}
                                </div>
                                <span className={cn("font-medium text-sm", isActive && "font-semibold")}>{item.name}</span>
                            </div>
                            {isActive && (
                                <>
                                    <div className={cn("absolute right-0 top-0 bottom-0 w-1 rounded-full", item.vip ? "bg-amber-500" : "bg-emerald-500")} />
                                    <ChevronRight className={cn("w-4 h-4", item.vip ? "text-amber-400" : "text-emerald-400")} />
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
                                {typeof balance === 'number' ? `₦${balance.toLocaleString()}` : 'Syncing...'}
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
