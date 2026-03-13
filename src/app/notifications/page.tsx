"use client"

import React, { useState, useEffect } from 'react'
import { Bell, Zap, Crown, Trophy, Settings, Megaphone, CheckCheck, RefreshCw, Circle } from 'lucide-react'

interface Notification {
    _id: string
    title: string
    body: string
    type: 'SIGNAL' | 'VIP' | 'RESULT' | 'SYSTEM' | 'PROMO'
    isRead: boolean
    link?: string
    createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
    SIGNAL:  { icon: Zap,       color: 'cyan',    label: 'Signal'  },
    VIP:     { icon: Crown,     color: 'amber',   label: 'VIP'     },
    RESULT:  { icon: Trophy,    color: 'emerald', label: 'Result'  },
    SYSTEM:  { icon: Settings,  color: 'slate',   label: 'System'  },
    PROMO:   { icon: Megaphone, color: 'purple',  label: 'Promo'   },
}

const FILTERS = ['All', 'SIGNAL', 'VIP', 'RESULT', 'SYSTEM', 'PROMO']

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [unreadCount, setUnreadCount] = useState(0)
    const [markingAll, setMarkingAll] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/notifications')
            const data = await res.json()
            if (Array.isArray(data.notifications)) {
                setNotifications(data.notifications)
            }
            setUnreadCount(data.unreadCount || 0)
        } catch (e) {
            console.error('Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchNotifications() }, [])

    const markRead = async (id: string) => {
        await fetch('/api/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        setNotifications(prev =>
            prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    const markAllRead = async () => {
        setMarkingAll(true)
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true })
            })
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } finally {
            setMarkingAll(false)
        }
    }

    const filtered = filter === 'All'
        ? notifications
        : notifications.filter(n => n.type === filter)

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const m = Math.floor(diff / 60000)
        if (m < 1) return 'Just now'
        if (m < 60) return `${m}m ago`
        const h = Math.floor(m / 60)
        if (h < 24) return `${h}h ago`
        return `${Math.floor(h / 24)}d ago`
    }

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[900px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col gap-4 pt-10">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-[1.5rem] bg-cyan-500 shadow-[0_10px_30px_rgba(6,182,212,0.3)] text-slate-950">
                            <Bell className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                                Signal <span className="text-cyan-400 italic">Alerts</span>
                            </h1>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                                Neural Notification Feed
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl">
                                <Circle className="w-2 h-2 fill-cyan-400 text-cyan-400" />
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                    {unreadCount} Unread
                                </span>
                            </div>
                        )}
                        <button
                            onClick={markAllRead}
                            disabled={markingAll || unreadCount === 0}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
                        >
                            {markingAll ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                            Mark All Read
                        </button>
                        <button
                            onClick={fetchNotifications}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap mt-2">
                    {FILTERS.map(f => {
                        const cfg = f !== 'All' ? TYPE_CONFIG[f] : null
                        const isActive = filter === f
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isActive
                                        ? cfg
                                            ? `bg-${cfg.color}-500/15 text-${cfg.color}-400 border border-${cfg.color}-500/30`
                                            : 'bg-white/10 text-white border border-white/10'
                                        : 'bg-white/[0.02] text-slate-500 border border-white/5 hover:text-slate-300 hover:bg-white/5'
                                }`}
                            >
                                {cfg && <cfg.icon className="w-3 h-3" />}
                                {f}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Feed */}
            <div className="flex flex-col gap-3">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="glass-card h-20 animate-pulse rounded-2xl" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="glass-card flex flex-col items-center justify-center py-32 text-center">
                        <Bell className="w-14 h-14 text-slate-800 mb-6" />
                        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                            Signal Queue Empty
                        </p>
                        <p className="text-slate-600 text-xs font-medium max-w-xs">
                            No notifications yet. AI engine alerts will appear here in real time.
                        </p>
                    </div>
                ) : (
                    filtered.map((notif) => {
                        const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG['SYSTEM']
                        return (
                            <div
                                key={notif._id}
                                onClick={() => { if (!notif.isRead) markRead(notif._id); if (notif.link) window.location.href = notif.link }}
                                className={`glass-card !p-6 flex items-start gap-5 transition-all cursor-pointer group hover:border-${cfg.color}-500/20 ${
                                    !notif.isRead
                                        ? `border-l-4 border-l-${cfg.color}-500 bg-${cfg.color}-500/[0.03]`
                                        : 'opacity-60 hover:opacity-90'
                                }`}
                                style={{ borderLeftColor: !notif.isRead ? undefined : 'transparent' }}
                            >
                                <div className={`p-3 rounded-2xl bg-${cfg.color}-500/10 border border-${cfg.color}-500/20 text-${cfg.color}-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <cfg.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white truncate">{notif.title}</span>
                                            {!notif.isRead && (
                                                <span className={`w-1.5 h-1.5 rounded-full bg-${cfg.color}-400 flex-shrink-0`} />
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-600 flex-shrink-0 tabular-nums">
                                            {timeAgo(notif.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{notif.body}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[8px] font-black text-${cfg.color}-500 bg-${cfg.color}-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest`}>
                                            {cfg.label}
                                        </span>
                                        {notif.link && (
                                            <span className="text-[9px] font-bold text-slate-600 hover:text-slate-400">
                                                View →
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
