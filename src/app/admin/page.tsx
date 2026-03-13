"use client"

import React, { useState, useEffect } from 'react'
import { 
    Settings, 
    ShieldAlert, 
    RefreshCw, 
    Database, 
    Zap, 
    Terminal, 
    CheckCircle2, 
    AlertTriangle,
    Play,
    Cpu,
    Network,
    Users,
    Crown,
    Search,
    UserCheck,
    UserX,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

interface UserRow {
    _id: string
    email: string
    tier: 'FREE' | 'VIP' | 'MONTHLY'
    subscriptionExpiry?: string
    balanceNaira: number
    createdAt: string
}

export default function AdminPage() {
    const [resolving, setResolving] = useState(false)
    const [status, setStatus] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'protocols' | 'users'>('protocols')
    const [logs, setLogs] = useState<string[]>([
        "SYSTEM_INIT: Neural gateway operational.",
        "DB_CONNECT: Authenticated to local MongoDB instance.",
        "SYNC: Prediction engine synchronized with v2.4.0-master."
    ])

    // User management state
    const [users, setUsers] = useState<UserRow[]>([])
    const [usersLoading, setUsersLoading] = useState(false)
    const [userSearch, setUserSearch] = useState('')
    const [userPage, setUserPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [promotingId, setPromotingId] = useState<string | null>(null)

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 12))
    }

    const fetchUsers = async (page = 1) => {
        setUsersLoading(true)
        try {
            const res = await fetch(`/api/admin/users?page=${page}`)
            const data = await res.json()
            setUsers(data.users || [])
            setTotalPages(data.pages || 1)
            setUserPage(page)
        } catch (e) {
            addLog('ERROR: Failed to load user matrix.')
        } finally {
            setUsersLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'users') fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    const handleSetTier = async (userId: string, tier: 'FREE' | 'VIP' | 'MONTHLY') => {
        setPromotingId(userId)
        try {
            const days = tier === 'VIP' ? 1 : tier === 'MONTHLY' ? 30 : 0
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action: 'setTier', tier, days })
            })
            const data = await res.json()
            if (data.success) {
                addLog(`USER_UPDATE: ${userId} promoted to ${tier}.`)
                fetchUsers(userPage)
            }
        } catch (e) {
            addLog('ERROR: Tier update failed.')
        } finally {
            setPromotingId(null)
        }
    }

    const handleResolve = async () => {
        setResolving(true)
        addLog("ADMIN_ACTION: Initiating mass bet resolution protocol...")
        try {
            const res = await fetch('/api/admin/resolve', { method: 'POST' })
            const data = await res.json()
            if (data.success) {
                setStatus(`SUCCESS: Resolved ${data.resolved} executions. ${data.won} WINS detected.`)
                addLog(`PROTOCOL_COMPLETE: ${data.resolved} bets synced. Vault balances updated.`)
            } else {
                setStatus(data.message || "No pending executions found.")
                addLog("PROTOCOL_IDLE: No pending bets in the queue.")
            }
        } catch (e) {
            addLog("ERROR: Connection to resolution node interrupted.")
        } finally {
            setResolving(false)
            setTimeout(() => setStatus(null), 5000)
        }
    }

    const handleResetCache = async () => {
        setResolving(true)
        addLog("ADMIN_ACTION: Flushing fixture cache and re-syncing...")
        try {
            const res = await fetch('/api/sync/live')
            const data = await res.json()
            if (data.success) {
                setStatus(`SUCCESS: Purged cache. Re-synced ${data.syncCount} match nodes.`)
                addLog(`PROTOCOL_COMPLETE: Cache flushed. ${data.syncCount} oracles active.`)
            }
        } catch (e) {
            addLog("ERROR: Cache purge failed.")
        } finally {
            setResolving(false)
            setTimeout(() => setStatus(null), 5000)
        }
    }

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.tier.toLowerCase().includes(userSearch.toLowerCase())
    )

    const tierColor = (tier: string) => {
        if (tier === 'VIP') return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        if (tier === 'MONTHLY') return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
        return 'text-slate-500 bg-white/5 border-white/10'
    }

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col gap-4 pt-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-rose-500 shadow-[0_10px_30px_rgba(225,29,72,0.3)] text-slate-950">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Master <span className="text-rose-500 italic">Console</span></h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized Operator Overrides Only</p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
                    {[
                        { id: 'protocols', label: 'Protocols', icon: Terminal },
                        { id: 'users',     label: 'User Matrix', icon: Users },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'protocols' | 'users')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white/10 text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Protocols Tab ── */}
            {activeTab === 'protocols' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="glass-card !p-10 relative overflow-hidden group border-rose-500/10">
                            <div className="absolute inset-0 bg-rose-500/[0.01] scanline pointer-events-none" />
                            <div className="flex items-center gap-3 mb-8">
                                <ShieldAlert className="w-6 h-6 text-rose-500" />
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Active <span className="text-rose-500">Protocols</span></h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-rose-500/20 transition-all flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                            <RefreshCw className={resolving ? "animate-spin" : ""} />
                                        </div>
                                        <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">Manual Sync Required</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white mb-1">Batch Resolution</h4>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Fetch match outcomes from historical oracles and finalize pending trades.</p>
                                    </div>
                                    <button onClick={handleResolve} disabled={resolving} className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2">
                                        {resolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                                        Execute Batch Resolve
                                    </button>
                                </div>
                                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><Database /></div>
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Direct-Link</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white mb-1">Cache Management</h4>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Purge fixture cache and force fresh data injection from primary API providers.</p>
                                    </div>
                                    <button onClick={handleResetCache} disabled={resolving} className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                                        {resolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                         Reset Grid Cache
                                    </button>
                                </div>
                            </div>
                            {status && (
                                <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{status}</span>
                                </div>
                            )}
                        </div>

                        <div className="glass-card !p-8 bg-slate-950/50 border-white/[0.02]">
                            <div className="flex items-center gap-3 mb-6">
                                <Terminal className="w-5 h-5 text-slate-500" />
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Execution Stream</h4>
                            </div>
                            <div className="flex flex-col gap-3 font-mono">
                                {logs.map((log, i) => (
                                    <div key={i} className="text-[10px] text-slate-400 border-l-2 border-slate-800 pl-4 py-1">{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="glass-card p-6 border-white/[0.05] bg-white/[0.01]">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Hardware Telemetry</h4>
                            <div className="space-y-6">
                                {[
                                    { name: 'Core Engine', status: 'Optimal',   icon: Cpu,     color: 'emerald' },
                                    { name: 'Oracle Link', status: 'Connected', icon: Network,  color: 'emerald' },
                                    { name: 'Matrix Load', status: 'Moderate',  icon: Zap,     color: 'orange' }
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-500`}><s.icon className="w-4 h-4" /></div>
                                            <span className="text-xs font-bold text-slate-300">{s.name}</span>
                                        </div>
                                        <span className={`text-[9px] font-black text-${s.color}-500 uppercase`}>{s.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-card p-8 border-rose-500/20 bg-rose-500/[0.02]">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Security Warning</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                Bypassing oracle consensus via <span className="text-white font-bold uppercase">Manual Batch Resolve</span> is an irreversible action. Ensure all external event logs are verified before execution.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── User Matrix Tab ── */}
            {activeTab === 'users' && (
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-black text-white uppercase tracking-widest">User Matrix</h2>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400" />
                            <input
                                type="text"
                                placeholder="Search by email or tier..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-cyan-500/30 transition-all w-72 placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="glass-card !p-0 overflow-hidden border-white/[0.03]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">User</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Tier</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Balance</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Expires</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {usersLoading ? (
                                        <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading User Matrix...</td></tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">No users found.</td></tr>
                                    ) : filteredUsers.map((user) => (
                                        <tr key={user._id} className="group hover:bg-white/[0.02] transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{user.email}</span>
                                                    <span className="text-[10px] text-slate-600 tabular-nums mt-0.5">
                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-widest flex items-center gap-1.5 justify-center w-fit mx-auto ${tierColor(user.tier)}`}>
                                                    {user.tier !== 'FREE' && <Crown className="w-2.5 h-2.5" />}
                                                    {user.tier}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-sm font-black text-white tabular-nums">₦{(user.balanceNaira || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : '—'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleSetTier(user._id, 'VIP')}
                                                        disabled={promotingId === user._id || user.tier === 'VIP'}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/20 disabled:opacity-30 transition-all"
                                                    >
                                                        <UserCheck className="w-3 h-3" /> VIP
                                                    </button>
                                                    <button
                                                        onClick={() => handleSetTier(user._id, 'MONTHLY')}
                                                        disabled={promotingId === user._id || user.tier === 'MONTHLY'}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 disabled:opacity-30 transition-all"
                                                    >
                                                        <Crown className="w-3 h-3" /> Monthly
                                                    </button>
                                                    <button
                                                        onClick={() => handleSetTier(user._id, 'FREE')}
                                                        disabled={promotingId === user._id || user.tier === 'FREE'}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 text-slate-500 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-30 transition-all"
                                                    >
                                                        <UserX className="w-3 h-3" /> Reset
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-8 py-5 border-t border-white/[0.05] bg-white/[0.01]">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Page {userPage} of {totalPages}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => fetchUsers(userPage - 1)}
                                        disabled={userPage <= 1}
                                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                                    ><ChevronLeft className="w-4 h-4" /></button>
                                    <button
                                        onClick={() => fetchUsers(userPage + 1)}
                                        disabled={userPage >= totalPages}
                                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                                    ><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}


