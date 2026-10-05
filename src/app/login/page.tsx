"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
              <ShieldAlert className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2">CyberForensics Hub</h1>
          <p className="text-center text-sm text-zinc-400 mb-8">Authenticate to access restricted investigation data.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Agent Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="investigator@agency.gov"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Passcode</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-zinc-950 border-zinc-800 text-white h-11 font-mono tracking-widest placeholder:tracking-normal"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-md tracking-wide mt-2 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Authenticating...
                </>
              ) : (
                "Access Secure Portal"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>

      {/* Dev helper to show what accounts exist since we seeded the DB */}
      <div className="mt-8 text-xs text-zinc-600 text-center max-w-sm">
        <p className="font-semibold text-zinc-500 mb-1">Demo Credentials:</p>
        <p>Admin: admin@cyberforensics.gov / password123</p>
        <p>Investigator: john.investigator@cyberforensics.gov / password123</p>
      </div>
    </div>
  );
}
