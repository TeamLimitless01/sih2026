"use client";

import { Bell, Search, LogOut, Command, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-20 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20 supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
          <Input
            placeholder="Search cases, entities, IP addresses, or evidence..."
            className="pl-10 pr-12 h-11 bg-zinc-900/50 border-white/5 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 w-full text-sm text-zinc-200 rounded-xl transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 font-mono text-[10px] font-medium text-zinc-400 bg-zinc-800 rounded border border-zinc-700">
              <Command className="w-3 h-3" /> K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 pl-6">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/5 hover:border-white/10 hover:bg-white/10">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#09090b]"></span>
        </button>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-zinc-200">{session?.user?.name || "Loading..."}</span>
            <div className="flex items-center gap-1 text-xs text-blue-400/80 font-mono mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              {session?.user?.role || "USER"}
            </div>
          </div>
          <Avatar className="h-10 w-10 border border-white/10 bg-zinc-900 ring-2 ring-transparent hover:ring-blue-500/30 transition-all cursor-pointer">
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold">
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
