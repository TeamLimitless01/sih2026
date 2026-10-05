import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { Slogan } from "@/components/ui/slogan";
import {
  Shield,
  ChevronRight,
  FileText,
  Network,
  Clock,
  Upload,
  Search,
  Link as LinkIcon,
  MousePointerClick,
  Sparkles,
  FileBarChart,
  Database,
  Share2,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  Brain,
  Lock,
  Eye,
  UserCheck
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-full border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-1.5 rounded-full border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold tracking-widest text-sm uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Drishti.AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-zinc-400 uppercase tracking-wider">
            <Link href="#problem" className="hover:text-white transition-colors">Problem</Link>
            <Link href="#solution" className="hover:text-white transition-colors">Solution</Link>
            <Link href="#capabilities" className="hover:text-white transition-colors">Capabilities</Link>
            <Link href="#security" className="hover:text-white transition-colors">Security</Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/cases"
                className="text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors"
              >
                Go to Workspace
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Investigator Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden border-b border-white/5">
        <SonarGrid className="absolute inset-0 z-0 opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/80 to-[#09090b] z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-8 uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Cyber Fraud Investigation Platform
          </div> */}
          <Slogan />
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-4 leading-relaxed">
            A unified platform for analyzing fragmented cyber-fraud evidence, discovering hidden relationships, and helping investigators identify actionable leads faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={session ? "/cases" : "/login"}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-blue-500 w-full sm:w-auto"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="#solution"
              className="inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-white/5 border border-white/10 rounded-full transition-all hover:bg-white/10 w-full sm:w-auto"
            >
              Explore the Platform
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm font-mono text-zinc-500 tracking-widest uppercase">
              CDR • IPDR • UPI • Bank Data • Email • Digital Artifacts
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 md:py-32 relative bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Cyber Fraud Evidence Is Fragmented.<br />Investigations Shouldn't Be.</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Investigators often work with evidence scattered across multiple files and data sources. Connecting phone numbers, devices, IP addresses, UPI IDs, bank accounts, and transactions manually takes valuable time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fragmented Evidence</h3>
              <p className="text-zinc-400 leading-relaxed">Critical information is distributed across CDR, IPDR, transaction records, emails, and other digital artifacts.</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hidden Connections</h3>
              <p className="text-zinc-400 leading-relaxed">Important relationships between devices, accounts, numbers, and transactions can remain buried inside large datasets.</p>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Time-Consuming Analysis</h3>
              <p className="text-zinc-400 leading-relaxed">Manual correlation makes it difficult to quickly identify suspicious patterns and cross-case connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 md:py-32 relative bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">One Platform. Every Connection.</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Drishti.AI brings digital evidence into a unified investigation environment. Upload evidence, extract meaningful entities, automatically correlate relationships, visualize investigation networks, and use AI to turn complex evidence into understandable investigative insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <WorkflowStep num="01" title="Upload" icon={<Upload />} desc="Import CDR, IPDR, UPI & Bank data." />
            <WorkflowStep num="02" title="Extract" icon={<Search />} desc="Identify IPs, IMEIs, & UPI IDs." />
            <WorkflowStep num="03" title="Correlate" icon={<LinkIcon />} desc="Connect entities across sources." />
            <WorkflowStep num="04" title="Investigate" icon={<MousePointerClick />} desc="Explore interactive graphs." />
            <WorkflowStep num="05" title="Analyze" icon={<Brain />} desc="AI highlights potential leads." />
            <WorkflowStep num="06" title="Report" icon={<FileBarChart />} desc="Generate structured reports." />
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-24 md:py-32 relative bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Faster Cyber-Fraud Investigation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <Database className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Evidence Intelligence</h3>
              <p className="text-zinc-400 mb-6">Bring multiple evidence formats into a single investigation workspace.</p>
              <div className="flex flex-wrap gap-2">
                {['CDR', 'IPDR', 'UPI', 'Bank Transactions', 'Email', 'Logs'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 text-zinc-300 text-xs rounded-full border border-white/10">{tag}</span>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 transition-colors group">
              <Network className="w-10 h-10 text-indigo-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Entity Correlation</h3>
              <p className="text-zinc-400 mb-6">Automatically connect related identifiers and devices across investigations.</p>
              <div className="flex flex-wrap gap-2">
                {['Phone Numbers', 'IMEI / IMSI', 'UPI IDs', 'Bank Accounts', 'IP Addresses', 'Emails', 'Devices', 'Transactions'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-full border border-indigo-500/20">{tag}</span>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <Share2 className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Investigation Graph</h3>
              <p className="text-zinc-400 mb-6">Visualize complex relationships between entities and discover connections that are difficult to see in raw datasets.</p>
              <p className="font-mono text-sm text-emerald-400/80">Explore → Filter → Trace → Investigate</p>
            </div>

            <div className="p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 transition-colors group">
              <AlertTriangle className="w-10 h-10 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Cross-Case Intelligence</h3>
              <p className="text-zinc-400 mb-6">Discover when the same phone number, UPI ID, IP address, device, or other artifact appears across multiple cases.</p>
              <p className="text-purple-300 font-medium text-sm">One artifact can reveal a wider network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investigation Graph Showcase & AI */}
      <section className="py-24 md:py-32 relative bg-zinc-900/30 border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">See the Network Behind the Fraud</h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Raw records can hide relationships. Our investigation graph connects entities across multiple evidence sources to reveal the bigger picture.
            </p>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 mb-8 font-mono text-sm text-zinc-300 flex flex-wrap gap-2 items-center">
              <span className="text-blue-400">Person</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-indigo-400">Phone</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-purple-400">IMEI</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-pink-400">IP</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-rose-400">UPI</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-orange-400">Bank Account</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-amber-400">Transaction</span> <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-emerald-400">Other Case</span>
            </div>

            <p className="text-sm text-zinc-500">
              Click any entity to explore its relationships, evidence sources, associated cases, and suspicious indicators.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl rounded-[3rem]" />
            <div className="relative bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                <Brain className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">From Data to Investigative Leads</h3>
                  <p className="text-sm text-zinc-400">AI works alongside deterministic correlation.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Detected Pattern</p>
                  <p className="font-medium text-rose-300">Same IMEI associated with multiple phone numbers.</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Related Evidence</p>
                  <div className="flex gap-2">
                    <span className="text-sm font-mono bg-black/50 px-2 py-1 rounded text-zinc-300">CDR_2026_09.csv</span>
                    <span className="text-sm font-mono bg-black/50 px-2 py-1 rounded text-zinc-300">CDR_2026_10.csv</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-xs text-blue-400/80 uppercase tracking-wider mb-1">AI Insight</p>
                  <p className="text-sm text-blue-100 leading-relaxed">The device identifier appears across multiple phone numbers. This may indicate device sharing, SIM replacement, or another relationship requiring investigator verification.</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <p className="text-xs text-emerald-400/80 uppercase tracking-wider mb-1">Recommended Lead</p>
                  <p className="text-sm text-emerald-100">Review the associated numbers and their activity timeline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section id="security" className="py-24 md:py-32 relative bg-[#09090b]">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <Fingerprint className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Evidence-Driven Investigation</h2>
          <p className="text-lg text-zinc-400">Strictly built for authorized personnel, ensuring high-security data processing.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
            <Lock className="w-8 h-8 text-blue-400 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-2">Role-Based Access</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Investigators, analysts, and administrators receive access based on their responsibilities.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
            <Database className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-2">Evidence Traceability</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Investigation findings can be traced back to their underlying evidence sources.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-2">Explainable Findings</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">Suspicious patterns are supported by identifiable relationships and clear logic rules.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 bg-zinc-900/30 rounded-2xl border border-white/5">
            <UserCheck className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h4 className="font-bold text-lg mb-2">Human-in-the-Loop AI</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">AI assists investigators. It does not replace investigator judgment or make final conclusions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative bg-blue-950/20 border-t border-blue-900/30 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Turn Fragmented Evidence Into Connected Intelligence.</h2>
          <p className="text-xl text-blue-200/80 mb-10">
            Investigate faster. Discover hidden relationships. Build stronger evidence-backed leads.
          </p>
          <Link
            href={session ? "/cases" : "/login"}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Enter Investigation Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="font-bold tracking-widest text-sm uppercase">Drishti.AI</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-6">
                AI-Powered Unified Cyber Fraud Analysis & Digital Artifact Correlator.
              </p>
              <p className="text-zinc-600 text-xs leading-relaxed max-w-md border border-white/5 p-4 rounded-xl bg-white/[0.02]">
                <strong>Disclaimer:</strong> Designed as a prototype for cyber-fraud investigation and digital artifact correlation. AI-generated insights are investigative assistance and require human verification.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#capabilities" className="hover:text-white transition-colors">Capabilities</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Investigation Graph</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">AI Analysis</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link href="/login" className="hover:text-white transition-colors">Investigator Login</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Analyst Access</Link></li>
                <li><Link href="/reports" className="hover:text-white transition-colors">Reports</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
              &copy; 2026 Smart India Hackathon. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              SIH 2026 Prototype
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function WorkflowStep({ num, title, icon, desc }: { num: string, title: string, icon: React.ReactNode, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-black/50 border border-white/5 relative group hover:bg-zinc-900 transition-colors">
      <div className="absolute top-4 right-4 text-xs font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">{num}</div>
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
        {icon}
      </div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  )
}
