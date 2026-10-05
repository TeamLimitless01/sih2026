import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Slogan } from "@/components/ui/slogan";
import {
  Shield,
  ChevronRight,
  FileText,
  Network,
  Search,
  Brain,
  Globe,
  ArrowRight,
  ScanFace,
  MessageSquare,
  Sparkles,
  Zap,
  BarChart3,
  Server,
  Link2,
  Database,
  Smartphone,
  Bitcoin,
  Layers,
  TrendingUp,
  Users,
  ShieldAlert,
  ShieldCheck,
  Key,
  Activity
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl transition-all">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-bold tracking-tight text-lg text-white">Drishti.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#capabilities" className="hover:text-white transition-colors">AI Capabilities</Link>
            <Link href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
            <Link href="#use-cases" className="hover:text-white transition-colors">Use Cases</Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/cases"
                className="text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                Go to Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Agent Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Animated Perspective Grid */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden [perspective:800px]">
          <div className="absolute w-[200%] h-[200%] bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_60%,transparent_100%)] animate-grid-scroll origin-[50%_0%] top-0 left-[-50%] border-t border-blue-500/40" style={{ transform: 'rotateX(60deg) translateY(-100px)' }}></div>
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-0 pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-mono mb-8 uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            AI-Native Cyber Intelligence
          </div>
           */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
            <Slogan />
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The intelligent operating system for cyber fraud analysis. Let our AI automatically ingest, correlate, and analyze your CDRs, IPs, and financial records to uncover hidden syndicates instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={session ? "/cases" : "/login"}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-blue-600 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] w-full sm:w-auto"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                Launch AI Workspace
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid AI Capabilities */}
      <section id="capabilities" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 shadow-inner">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">An AI brain for your investigations.</h2>
            <p className="text-lg text-zinc-400">Drishti.AI doesn't just store data; it understands it. From automated parsing to narrative generation, every feature is infused with artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Big Feature 1: Evidence Interrogation */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-blue-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Conversational Evidence Interrogation</h3>
                  <p className="text-zinc-400 max-w-md">Stop running complex SQL queries. Just ask the AI: <span className="italic text-zinc-300">"Which IPs were shared by Suspect A and Suspect B between August 1st and August 5th?"</span> and get immediate, verifiable answers.</p>
                </div>
                <div className="mt-8 flex flex-col gap-3">
                  <div className="bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-2xl rounded-tr-sm p-4 w-fit self-end text-sm max-w-[80%]">
                    Did any suspects wire money to accounts in Dubai?
                  </div>
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl rounded-tl-sm p-4 w-fit text-sm max-w-[80%] flex gap-3">
                    <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-zinc-300">Yes, <span className="font-semibold text-white">Target #4 (+91 98765 43210)</span> initiated 3 wire transfers to UAE-based accounts totaling $45,000 on Oct 12th. <span className="text-blue-400 hover:underline cursor-pointer">View Txn Logs</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Parsers */}
            <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-emerald-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Automated Parsing</h3>
                  <p className="text-zinc-400">Upload messy, unstructured PDF bank statements or massive CSV CDR logs. Our AI instantly normalizes and extracts entities without manual mapping.</p>
                </div>
                <div className="mt-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-sm text-zinc-500 font-mono">
                    <span>RAW PDF</span> <ArrowRight className="w-3 h-3 text-emerald-400" /> <span>STRUCTURED DATA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Global OSINT Search */}
            <div className="relative group overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">AI OSINT Search</h3>
                  <p className="text-zinc-400">Search a suspect's phone number or email globally. The AI scrapes the open web and leaks, summarizing its findings instantly.</p>
                </div>
              </div>
            </div>

            {/* Feature 4: Visual Graph */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-indigo-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <Network className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">Predictive Correlation Graph</h3>
                  <p className="text-zinc-400 max-w-md">Drishti.AI maps connections between entities automatically. But more importantly, the AI highlights <span className="text-white font-medium">implicit relationships</span>—predicting shared aliases, devices, or syndicates based on behavioral overlaps.</p>
                </div>
                <div className="mt-8 h-48 rounded-xl border border-white/10 bg-black/50 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <svg className="absolute inset-0 w-full h-full">
                      <path d="M 150 100 Q 250 50 350 100" fill="none" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                    </svg>
                    <div className="absolute top-20 left-32 w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="absolute top-20 right-32 w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                      <ScanFace className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-1 rounded-full border border-indigo-500/30">
                      AI: High Probability Match
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: AI Reports */}
            <div className="md:col-span-3 relative group overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 hover:border-rose-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">AI-Generated Legal Reports</h3>
                  <p className="text-zinc-400 max-w-2xl">
                    Drafting court-ready reports takes days. Drishti.AI generates comprehensive, chronological narratives of a case at the click of a button. The LLM weaves the evidence together into a factual, unbiased summary ready for export.
                  </p>
                </div>
                <div className="w-full md:w-72 flex-shrink-0 bg-black/50 border border-white/10 rounded-xl p-4">
                  <div className="flex gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                    <div className="h-2 w-full bg-zinc-800 rounded"></div>
                    <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                    <div className="h-2 w-1/2 bg-blue-500/40 rounded mt-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-24 relative border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 shadow-inner">
              <Layers className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">A Unified Intelligence Ecosystem.</h2>
            <p className="text-lg text-zinc-400">Drishti.AI seamlessly ingests and normalizes data from disparate sources, allowing you to cross-reference telecom records with banking and dark web artifacts in one unified canvas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black border border-white/5 rounded-2xl p-6 text-center hover:bg-zinc-900 transition-colors">
              <Smartphone className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Telecom & ISPs</h4>
              <p className="text-sm text-zinc-500">Automated CDR & IPDR parsing. Geolocation tracking.</p>
            </div>

            <div className="bg-black border border-white/5 rounded-2xl p-6 text-center hover:bg-zinc-900 transition-colors">
              <Database className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Financial Institutions</h4>
              <p className="text-sm text-zinc-500">Bank statements, UPI txn logs, and wire transfers.</p>
            </div>

            <div className="bg-black border border-white/5 rounded-2xl p-6 text-center hover:bg-zinc-900 transition-colors">
              <Bitcoin className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Crypto Exchanges</h4>
              <p className="text-sm text-zinc-500">Wallet clustering and illicit transaction tracing.</p>
            </div>

            <div className="bg-black border border-white/5 rounded-2xl p-6 text-center hover:bg-zinc-900 transition-colors">
              <Globe className="w-10 h-10 text-rose-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Open & Dark Web</h4>
              <p className="text-sm text-zinc-500">Social media footprints, leaked DBs, and forums.</p>
            </div>
          </div>

          {/* <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3">
              <Link2 className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-300 text-sm font-medium">Native API Integrations available for enterprise deployments.</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 relative border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for complex investigations.</h2>
            <p className="text-lg text-zinc-400">Drishti.AI is battle-tested against modern, multi-layered cybercrimes. Accelerate the resolution of high-profile cases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1 */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900/80 transition-colors">
              <TrendingUp className="w-8 h-8 text-rose-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Investment & "Pig Butchering" Scams</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Track illicit fund flows from victim bank accounts into crypto exchanges. Drishti.AI automatically correlates wire transfers with known malicious crypto wallets, while OSINT tools uncover the real identities behind spoofed trading platforms.
              </p>
            </div>

            {/* Case 2 */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900/80 transition-colors">
              <Users className="w-8 h-8 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Money Mule Networks</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Identify "mule" accounts by analyzing high-velocity transaction bursts across hundreds of parsed bank statements. The AI graph instantly flags when multiple seemingly unrelated accounts share the same login IP address or device MAC address.
              </p>
            </div>

            {/* Case 3 */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 hover:bg-zinc-900/80 transition-colors">
              <ShieldAlert className="w-8 h-8 text-amber-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Dark Web Trafficking</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Connect the dots between seized vendor devices, PGP keys, and cryptocurrency transactions. Our OSINT parser scans dark web marketplaces to map a target's online aliases directly to their physical telecom footprints (CDRs).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Stop drowning in data. Start investigating.</h2>
          <p className="text-xl text-zinc-400 mb-10">Experience the only cyber-fraud investigation platform built from the ground up for the AI era.</p>
          <Link
            href={session ? "/cases" : "/login"}
            className="inline-flex items-center justify-center px-10 py-5 font-bold text-black bg-white rounded-2xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] text-lg"
          >
            Enter the AI Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black text-center text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ScanFace className="w-4 h-4" /> Drishti.AI
          </div>
          <p>© {new Date().getFullYear()} Drishti.AI. AI-Native Cyber Intelligence.</p>
          <div className="flex gap-4 font-mono text-xs uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Platform</span>
            <span className="hover:text-white cursor-pointer transition-colors">Capabilities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
