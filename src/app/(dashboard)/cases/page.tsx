import Link from "next/link";
import { Plus, Search, Filter, ShieldAlert, CreditCard, Smartphone, ShieldQuestion, Calendar, IndianRupee, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 pt-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        {/* Subtle background glow for the header */}
        <div className="absolute top-0 left-0 w-96 h-32 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-4 uppercase tracking-wider backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5" />
            Workspace
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Case Management
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Monitor and prioritize ongoing cyber fraud investigations. Access the interactive timeline and cross-case intelligence correlator to break down evidence.
          </p>
        </div>
        <Link href="/cases/new" className="relative z-10 group inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all bg-white text-black hover:bg-zinc-200 h-11 px-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
          <Plus className="w-4 h-4 mr-2 text-black" />
          Initialize Case
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
        <div className="relative flex-1 w-full max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
          <Input 
            placeholder="Search by Case ID, Title, or Victim..." 
            className="pl-10 h-11 bg-black/40 backdrop-blur-xl border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 text-zinc-200 w-full rounded-xl shadow-inner transition-all"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-white/10 text-zinc-300 bg-black/40 backdrop-blur-xl hover:bg-white/10 hover:text-white transition-all w-full sm:w-auto px-6">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Cases Table */}
      <Card className="bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden rounded-2xl relative z-10">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-[120px] font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Case ID</TableHead>
              <TableHead className="font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Investigation Details</TableHead>
              <TableHead className="font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Category</TableHead>
              <TableHead className="font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Amount</TableHead>
              <TableHead className="font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Status</TableHead>
              <TableHead className="font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Priority</TableHead>
              <TableHead className="text-right font-semibold text-zinc-400 uppercase text-[11px] tracking-wider py-4">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500 space-y-3">
                    <div className="p-3 bg-white/5 rounded-full border border-white/10">
                      <ShieldQuestion className="w-6 h-6 opacity-80" />
                    </div>
                    <p className="text-sm font-medium">No active cases found. Create a new case to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c) => (
                <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.03] transition-all duration-300 group cursor-pointer relative">
                  <TableCell className="font-medium py-4">
                    <Link href={`/cases/${c.id}`} className="text-blue-400 group-hover:text-blue-300 transition-colors inline-flex items-center gap-1 font-mono text-sm">
                      {c.caseNumber}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-200 font-semibold group-hover:text-white transition-colors">{c.title}</span>
                      <span className="text-zinc-500 text-xs line-clamp-1 flex items-center gap-1">
                        Victim: <span className="text-zinc-400">{c.victimName || "Unknown"}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="inline-flex items-center gap-2 text-zinc-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      {c.fraudType.toLowerCase().includes('upi') || c.fraudType.toLowerCase().includes('bank') ? (
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      ) : c.fraudType.toLowerCase().includes('telecom') || c.fraudType.toLowerCase().includes('sim') ? (
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="text-xs font-medium">{c.fraudType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-zinc-200 font-mono text-sm">
                      <IndianRupee className="w-3 h-3 mr-1 text-zinc-500" />
                      {c.fraudAmount ? new Intl.NumberFormat('en-IN').format(c.fraudAmount) : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`
                      text-[10px] uppercase tracking-wider font-bold px-2 py-0.5
                      ${c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-zinc-400 border-white/10'}
                    `}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`
                      text-[10px] uppercase tracking-wider font-bold px-2 py-0.5
                      ${c.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 
                        c.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                        c.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                        'bg-white/5 text-zinc-400 border-white/10'}
                    `}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end text-zinc-400 text-xs font-medium bg-white/5 px-2.5 py-1 rounded-md border border-white/5 w-fit ml-auto">
                      <Calendar className="w-3 h-3 mr-1.5 opacity-50" />
                      {c.incidentDate ? new Date(c.incidentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
