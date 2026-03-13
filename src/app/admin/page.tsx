"use client"

import React, { useState } from 'react'
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
    Network
} from 'lucide-react'

export default function AdminPage() {
    const [resolving, setResolving] = useState(false)
    const [status, setStatus] = useState<string | null>(null)
    const [logs, setLogs] = useState<string[]>([
        "SYSTEM_INIT: Neural gateway operational.",
        "DB_CONNECT: Authenticated to local MongoDB instance.",
        "SYNC: Prediction engine synchronized with v2.4.0-master."
    ])

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10))
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

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col gap-4 pt-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-rose-500 shadow-[0_10px_30px_rgba(225,29,72,0.3)] text-slate-950">
                        <Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic text-shadow-glow">Master <span className="text-rose-500 italic">Console</span></h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized Operator Overrides Only</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Protocol Controls */}
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
                                <button 
                                    onClick={handleResolve}
                                    disabled={resolving}
                                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {resolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                                    Execute Batch Resolve
                                </button>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <Database />
                                    </div>
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Direct-Link</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-white mb-1">Cache Management</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Purge fixture cache and force fresh data injection from primary API providers.</p>
                                </div>
                                <button className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Reset Grid Cache
                                </button>
                            </div>
                        </div>

                        {status && (
                            <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
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
                                <div key={i} className="text-[10px] text-slate-400 border-l-2 border-slate-800 pl-4 py-1">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Stats */}
                <div className="flex flex-col gap-6">
                   <div className="glass-card p-6 border-white/[0.05] bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Hardware Telemetry</h4>
                        <div className="space-y-6">
                            {[
                                { name: 'Core Engine', status: 'Optimal', icon: Cpu, color: 'emerald' },
                                { name: 'Oracle Link', status: 'Connected', icon: Network, color: 'emerald' },
                                { name: 'Matrix Load', status: 'Moderate', icon: Zap, color: 'orange' }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-${s.color}-500/10 text-${s.color}-500`}>
                                            <s.icon className="w-4 h-4" />
                                        </div>
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
        </div>
    )
}
