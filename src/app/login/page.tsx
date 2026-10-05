"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Fingerprint, LockKeyhole, ArrowRight, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Login successful!");
        router.push("/cases");
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-black overflow-hidden selection:bg-blue-500/30">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-zinc-950/50 border-r border-white/5">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <ScanFace className="w-7 h-7 text-blue-400" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight font-sans">Drishti.AI</span>
        </div>

        <div className="relative z-10 max-w-xl">
          {/* <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20 mb-6 py-1.5 px-3 uppercase tracking-widest text-[10px]">
            Restricted Access Portal
          </Badge> */}
          <h1 className="text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Connect the Dots. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              Uncover the Network.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            A unified platform for analyzing fragmented cyber-fraud evidence, discovering hidden relationships, and identifying actionable leads faster.
          </p>
        </div>

        {/* <div className="relative z-10 flex items-center gap-4 text-xs text-zinc-500 font-mono tracking-wider">
          <span>SECURE ENCLAVE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div> */}
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        <div className="w-full max-w-sm relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <ScanFace className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Drishti.AI</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-zinc-400 text-sm">Authenticate your identity to continue.</p>
          </div>

          <form id="login-form" onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-xs uppercase tracking-widest font-semibold">
                Agent Email ID
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="investigator@drishti.cyber"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 h-12 pl-11 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all shadow-inner"
                />
                <ShieldAlert className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300 text-xs uppercase tracking-widest font-semibold">
                  Passcode
                </Label>
                <span className="text-[10px] text-zinc-500 hover:text-blue-400 cursor-pointer transition-colors uppercase tracking-wider font-semibold">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-zinc-900/50 border-zinc-800 text-white h-12 pl-11 font-mono tracking-widest placeholder:tracking-normal rounded-xl focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all shadow-inner"
                />
                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-medium text-md tracking-wide mt-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Access Secure Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Test Login Buttons */}
          <div className="mt-10 pt-8 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Demo Access
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="bg-zinc-900/30 border-white/5 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl h-10 text-xs font-medium"
                onClick={() => {
                  setEmail("admin@drishti.cyber");
                  setPassword("password123");
                  setTimeout(() => {
                    const form = document.getElementById("login-form") as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }, 100);
                }}
              >
                Test as Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-zinc-900/30 border-white/5 text-zinc-300 hover:bg-white/5 hover:text-white rounded-xl h-10 text-xs font-medium"
                onClick={() => {
                  setEmail("investigator@drishti.cyber");
                  setPassword("password123");
                  setTimeout(() => {
                    const form = document.getElementById("login-form") as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }, 100);
                }}
              >
                Test as Inv.
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
