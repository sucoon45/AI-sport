"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Lock } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const res = await fetch('/api/auth', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password }) 
            })
            const data = await res.json()
            
            if (data.success) {
                router.push('/')
                router.refresh()
            } else {
                // If login fails, try to register them for this demo/initial setup
                // Alternatively show error. Let's try to register if it's a first time user.
                const regRes = await fetch('/api/auth', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'register', email, password }) 
                })
                const regData = await regRes.json()
                if (regData.success) {
                    router.push('/')
                    router.refresh()
                } else {
                    alert(data.message || 'Authentication failed')
                    setLoading(false)
                }
            }
        } catch (err) {
            alert('Connection error')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card p-10 border-white/[0.05] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all duration-700" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Zap className="w-7 h-7 text-slate-950 fill-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">SportAI</h1>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Authorized Access Only</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Node Identifier (Email)</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500/50 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm placeholder:text-slate-600"
                            placeholder="operator@matrix.net"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Security Clearance (Password)</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-emerald-500/50 focus:outline-none focus:bg-white/10 transition-all font-mono text-sm placeholder:text-slate-600"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        disabled={loading}
                        type="submit" 
                        className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] disabled:opacity-70 disabled:active:scale-100"
                    >
                        {loading ? 'Authenticating...' : <><Lock className="w-4 h-4" /> Link Command Center</>}
                    </button>
                </form>
            </div>
        </div>
    )
}
