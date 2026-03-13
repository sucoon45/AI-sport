"use client"

import React, { useState } from 'react'
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownRight, 
    CreditCard, 
    Coins, 
    Plus, 
    RefreshCw,
    ShieldCheck,
    Link as LinkIcon
} from 'lucide-react'

export default function WalletPage() {
    const [loading, setLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null)
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
    const [amount, setAmount] = useState('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [banks, setBanks] = useState<any[]>([])
    const [selectedBank, setSelectedBank] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountName, setAccountName] = useState('')

    const fetchWallet = async () => {
        try {
            const res = await fetch('/api/user/wallet')
            const data = await res.json()
            if (data.error || typeof data.balanceNaira !== 'number') {
                window.location.href = '/login'
                return
            }
            setUser(data)
        } catch (e) {
            console.error('Failed to fetch wallet')
        } finally {
            setLoading(false)
        }
    }

    const fetchBanks = async () => {
        try {
            const res = await fetch('/api/banks')
            const data = await res.json()
            setBanks(data)
        } catch (e) {}
    }

    const handleInitializeDeposit = async () => {
        if (!amount || isNaN(Number(amount))) return
        setLoading(true)
        try {
            const res = await fetch('/api/user/wallet/deposit/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount) })
            })
            const data = await res.json()
            if (data.authorization_url) {
                window.location.href = data.authorization_url
            }
        } catch (e) {
            console.error('Deposit Error:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async () => {
        if (!amount || !selectedBank || !accountNumber || !accountName) return
        setLoading(true)
        try {
            const res = await fetch('/api/user/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    bankCode: selectedBank,
                    accountNumber,
                    accountName
                })
            })
            const data = await res.json()
            if (data.success) {
                alert(data.message)
                setIsWithdrawModalOpen(false)
                fetchWallet()
            } else {
                alert(data.error)
            }
        } catch (e) {
            console.error('Withdraw Error:', e)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchWallet()
        fetchBanks()
    }, [])

    if (loading || !user) return <div className="flex items-center justify-center h-screen text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em]">Syncing Vault...</div>

    return (
        <div className="flex flex-col gap-10 pb-20 max-w-[1400px] mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col gap-4 pt-10">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[1.5rem] bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] text-slate-950">
                        <Wallet className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Capital <span className="gradient-text italic">Command</span></h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Multi-Currency Asset Management {loading && <RefreshCw className="inline w-4 h-4 animate-spin ml-2 text-emerald-500" />}</p>
                    </div>
                </div>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Naira Wallet */}
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/10" />
                    <div className="relative z-10 p-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <CreditCard className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fiat Account</p>
                                    <h3 className="text-lg font-bold text-white">Naira (NGN)</h3>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase">Settlement Node</span>
                        </div>

                        <div className="mb-10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Available Balance</p>
                            <h2 className="text-5xl font-black text-white tracking-tighter">₦{(user?.balanceNaira || 0).toLocaleString()}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setIsDepositModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Deposit Naira
                            </button>
                            <button 
                                onClick={() => setIsWithdrawModalOpen(true)}
                                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95"
                            >
                                <ArrowDownRight className="w-4 h-4" /> Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                {/* Crypto Wallet */}
                <div className="glass-card relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-cyan-500/10" />
                    <div className="relative z-10 p-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                    <Coins className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Assets</p>
                                    <h3 className="text-lg font-bold text-white">Blockchain (Crypto)</h3>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase">Mainnet v3</span>
                        </div>

                        <div className="mb-10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Portfolio Balance</p>
                            <h2 className="text-5xl font-black text-white tracking-tighter">{(user?.balanceCrypto || 0).toFixed(3)} <span className="text-2xl text-cyan-500">ETH</span></h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                className="flex items-center justify-center gap-2 bg-cyan-500/50 cursor-not-allowed text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
                            >
                                <Plus className="w-4 h-4" /> Fund Crypto
                            </button>
                            <button 
                                className="flex items-center justify-center gap-2 bg-white/5 cursor-not-allowed text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                            >
                                <ArrowUpRight className="w-4 h-4" /> Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Linked Accounts Section */}
            <div className="glass-card relative overflow-hidden group !p-10">
                <div className="absolute inset-0 bg-emerald-500/[0.01] scanline pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-2 uppercase italic">Linked <span className="gradient-text">Consoles</span></h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Synchronize with external sportsbook accounts</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-white/10 transition-all">
                        <LinkIcon className="w-4 h-4" /> Link New Source
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {user.linkedAccounts && user.linkedAccounts.length > 0 ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        user.linkedAccounts.map((p: any, i: number) => (
                            <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/20 transition-all group/item">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-3xl">{p.provider === 'SportyBet' ? '⚽' : p.provider === 'Bet9ja' ? '🦅' : '🌐'}</div>
                                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${p.connected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {p.connected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                                <h4 className="text-lg font-black text-white mb-1">{p.provider}</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">User: {p.username}</p>
                                
                                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover/item:text-white group-hover/item:bg-white/10 transition-all">
                                    <RefreshCw className="w-3 h-3 group-hover/item:rotate-180 transition-transform duration-700" />
                                    Sync Data
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-[2.5rem] bg-white/[0.01]">
                            <LinkIcon className="w-12 h-12 text-slate-800 mb-4 opacity-50" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Accounts Linked</p>
                            <p className="text-slate-600 text-[10px] mt-1">Connect your sportsbooks to enable direct distribution.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                    <div className="glass-card w-full max-w-md !p-10 border-emerald-500/20 relative">
                        <button onClick={() => setIsDepositModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase italic">Replenish <span className="text-emerald-500">Vault</span></h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Amount (NGN)</label>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <button 
                                onClick={handleInitializeDeposit}
                                disabled={loading || !amount}
                                className="w-full bg-emerald-500 text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Initialize Secure Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                    <div className="glass-card w-full max-w-md !p-10 border-rose-500/20 relative">
                        <button onClick={() => setIsWithdrawModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase italic">Withdraw <span className="text-rose-500">Funds</span></h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Bank</label>
                                <select 
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-rose-500 transition-all text-sm"
                                >
                                    <option value="" className="bg-slate-900">Select Bank</option>
                                    {banks.map(bank => (
                                        <option key={bank.code} value={bank.code} className="bg-slate-900">{bank.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Number</label>
                                <input 
                                    type="text" 
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-rose-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Account Name</label>
                                <input 
                                    type="text" 
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-rose-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Amount (NGN)</label>
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-rose-500 transition-all"
                                />
                            </div>
                            <button 
                                onClick={handleWithdraw}
                                disabled={loading || !amount || !selectedBank}
                                className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-600/20 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Transfer to Bank'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-4 px-10 py-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 border-dashed">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    All assets are secured via <span className="text-emerald-400 font-bold">256-bit AES Encryption</span> and stored on decentralized vault nodes. 
                    Naira settlements are processed via <span className="text-white font-bold">Paystack Secure Gateway</span>.
                    External bets are transmitted via encrypted web-socket tunnels.
                </p>
            </div>
        </div>
    )
}

