"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SignalAlert from "@/components/SignalAlert";
import Header from "@/components/Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
        <div className="bg-[#020617] min-h-screen text-slate-100 selection:bg-emerald-500/30">
            {children}
        </div>
    );
  }

  return (
    <>
        <Sidebar />
        <SignalAlert />
        <main className="pl-[280px] min-h-screen relative overflow-hidden bg-[#0a0a0b]">
          {/* Background Glows */}
          <div className="glow-point top-[-10%] right-[-10%] bg-cyan-500" />
          <div className="glow-point bottom-[-10%] left-[20%] bg-emerald-500" />
          
          <div className="p-8">
            {children}
          </div>
        </main>
    </>
  );
}
