"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  Eye, 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  Network,
  FileText,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cases", href: "/cases", icon: Briefcase },
  { name: "Global Search", href: "/search", icon: Search },
  { name: "Cross-Correlation", href: "/network", icon: Network },
  { name: "Reports", href: "/reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex flex-col w-72 border-r border-white/5 bg-[#09090b] text-zinc-300 min-h-screen relative overflow-hidden">
      {/* subtle glowing orb in the top left */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="flex items-center gap-3 px-6 py-8 relative z-10">
        <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Eye className="w-5 h-5 text-blue-400" />
        </div>
        <span className="font-bold text-lg uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Drishti.AI
        </span>
      </div>

      <div className="px-6 pb-4">
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Investigator Portal</div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-blue-500/10 text-blue-100 border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "hover:bg-white/5 hover:text-zinc-100 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span className={cn("text-sm font-medium", isActive && "font-semibold tracking-wide")}>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-500/50" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 relative z-10 space-y-2">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
        {session?.user?.role === "ADMIN" && (
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-zinc-400 hover:text-zinc-100"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Platform Settings</span>
          </Link>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-all text-zinc-500 hover:text-rose-400 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Disconnect Session</span>
        </button>
      </div>
    </div>
  );
}
