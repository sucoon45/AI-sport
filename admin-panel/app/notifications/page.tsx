"use client";

import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Send,
  Target,
  Trophy,
  Star,
  Zap,
  MoreVertical,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New VIP Signal: Milan vs Inter', body: 'High confidence BTTS prediction available now.', type: 'VIP Alert', sent: '2 mins ago', reach: '3,820 users' },
    { id: 2, title: 'Network Maintenance', body: 'Backend services will be updated at 02:00 UTC.', type: 'System', sent: '1 hour ago', reach: '12,450 users' },
    { id: 3, title: 'Winning Streak!', body: 'Celebrate our 85% success rate this weekend!', type: 'Promotion', sent: '5 hours ago', reach: '8,120 users' },
    { id: 4, title: 'Match Result: Man City 2-1 Arsenal', body: 'AI Prediction [Home Win] was successful.', type: 'Result', sent: 'Yesterday', reach: '5,500 users' },
  ]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Engine</h1>
          <p className="text-text-muted mt-1">Broadcast signals and system updates to all users</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-2xl font-bold hover:opacity-90 transition-all glow-primary">
          <Send size={18} />
          Send New Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Notifications List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Broadcast History</h3>
            <div className="flex bg-surface p-1 rounded-xl border border-border">
              <button className="px-4 py-1.5 bg-primary text-background rounded-lg font-bold text-xs">All</button>
              <button className="px-4 py-1.5 text-text-muted font-bold text-xs hover:text-foreground">Signals Only</button>
            </div>
          </div>

          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="glass p-6 rounded-3xl border border-border group hover:border-primary/50 transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      n.type === 'VIP Alert' ? 'bg-secondary/20 text-secondary' :
                      n.type === 'System' ? 'bg-accent/20 text-accent' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {n.type === 'VIP Alert' ? <Star size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground tracking-tight">{n.title}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">{n.type}</span>
                      </div>
                      <p className="text-text-muted text-sm mt-1">{n.body}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                          <Clock size={12} />
                          {n.sent}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted">
                          <CheckCircle size={12} />
                          Delivered to {n.reach}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-text-muted hover:text-primary transition-colors hover:bg-white/5 rounded-xl">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Send Sidebar */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[40px] border border-border">
            <h3 className="text-lg font-bold mb-6">Quick Signal</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Notification Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-xs">VIP Signal</button>
                  <button className="p-3 bg-surface border border-border rounded-xl text-text-muted font-bold text-xs">System Info</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Message Body</label>
                <textarea 
                  className="w-full h-32 p-4 bg-surface border border-border rounded-2xl focus:outline-none focus:border-primary/50 text-sm"
                  placeholder="Type your message broadcast..."
                ></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 glow-primary transition-all">
                Broadcast Now
              </button>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-[40px] border border-white/5">
            <h4 className="font-bold mb-2">Delivery Stats</h4>
            <div className="space-y-4 mt-4">
               <div>
                 <div className="flex justify-between text-xs font-bold mb-1">
                   <span>Push Notification Opt-in</span>
                   <span className="text-primary">92%</span>
                 </div>
                 <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold mb-1">
                   <span>Email Open Rate</span>
                   <span className="text-secondary">64%</span>
                 </div>
                 <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                   <div className="h-full bg-secondary" style={{ width: '64%' }}></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
