import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileBox, Users, Activity, Calendar, User, ShieldAlert, IndianRupee, MapPin, Eye, Download } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvidenceUpload } from "@/components/evidence-upload";
import { NetworkGraph } from "@/components/network-graph";
import { AddEntitySheet } from "@/components/add-entity-sheet";
import { EditCaseSheet } from "@/components/edit-case-sheet";
import { GenerateAIButton } from "@/components/generate-ai-button";
import { AIChat } from "@/components/ai-chat";
import { InvestigateLinkagesSheet } from "@/components/investigate-linkages-sheet";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const caseId = resolvedParams.id;
  const session = await getServerSession(authOptions);
  const canEdit = session?.user?.role === "ADMIN" || session?.user?.role === "INVESTIGATOR";

  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      createdBy: true,
      evidence: true,
      caseEntities: {
        include: {
          entity: {
            include: {
              caseEntities: {
                include: {
                  case: true
                }
              }
            }
          }
        }
      },
      events: {
        orderBy: { timestamp: 'desc' }
      },
      findings: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!caseData) {
    notFound();
  }

  return (
    <div className="max-w-none w-full mx-auto space-y-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/cases" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-800/50 h-9 px-4 py-2 text-zinc-400 hover:text-zinc-100 border border-zinc-800 bg-zinc-950 shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">{caseData.caseNumber}</h1>
              <Badge variant="outline" className={
                caseData.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700'
              }>
                {caseData.status}
              </Badge>
              <Badge variant="outline" className={
                caseData.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' :
                  caseData.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    caseData.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-zinc-800/50 text-zinc-400 border-zinc-700'
              }>
                {caseData.priority} Priority
              </Badge>
            </div>
            <p className="text-zinc-400 mt-1">{caseData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GenerateAIButton caseId={caseId} />
          <Link href={`/print/${caseId}`} target="_blank">
            <Button variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white">
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
          </Link>
          {canEdit && <EditCaseSheet caseData={caseData as any} />}
        </div>
      </div>

      {/* Metadata Banner */}
      <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Fraud Category</p>
              <p className="text-sm font-medium text-zinc-200">{caseData.fraudType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5" /> Defrauded Amount</p>
              <p className="text-sm font-medium text-red-400">
                {caseData.fraudAmount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(caseData.fraudAmount) : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Victim</p>
              <p className="text-sm font-medium text-zinc-200">{caseData.victimName || "Unknown"}</p>
              <p className="text-xs text-zinc-500">{caseData.victimPhone || ""}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Jurisdiction</p>
              <p className="text-sm font-medium text-zinc-200 line-clamp-1">{caseData.location || "Unknown"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Incident Date</p>
              <p className="text-sm font-medium text-zinc-200">
                {caseData.incidentDate ? new Date(caseData.incidentDate).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Created By</p>
              <p className="text-sm font-medium text-zinc-200">{caseData.createdBy.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Full-Width Tabs */}
      <Tabs defaultValue="network" className="w-full flex flex-col">
        <TabsList className="bg-black/40 backdrop-blur-xl border border-white/10 w-full flex h-16 p-1.5 rounded-2xl overflow-x-auto shadow-inner mb-2">
          <TabsTrigger value="network" className="flex-1 min-w-[160px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">Network Graph</TabsTrigger>
          <TabsTrigger value="overview" className="flex-1 min-w-[160px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">Case Details</TabsTrigger>
          <TabsTrigger value="evidence" className="flex-1 min-w-[160px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">Digital Evidence ({caseData.evidence.length})</TabsTrigger>
          <TabsTrigger value="entities" className="flex-1 min-w-[160px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">Extracted Entities ({caseData.caseEntities.length})</TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1 min-w-[160px] data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">Timeline ({caseData.events.length})</TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 min-w-[160px] data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 data-[state=active]:border-purple-500/30 border border-transparent text-zinc-400 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide">🤖 AI Copilot</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="mt-6 w-full">
          <Card className="bg-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
              <CardTitle className="text-zinc-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Interactive Correlator
              </CardTitle>
              <CardDescription className="text-zinc-400">Visual node graph mapping the relationships between extracted entities and this case.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <NetworkGraph
                caseData={caseData}
                entities={caseData.caseEntities.map(ce => ce.entity)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6 w-full">
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl w-full">
            <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
              <CardTitle className="text-zinc-200">AI Investigator Copilot</CardTitle>
              <CardDescription className="text-zinc-400">Ask questions, request summaries, or have the AI cross-reference the data in this case file.</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <AIChat caseId={caseId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="mt-6 w-full">
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl w-full">
            <CardHeader>
              <CardTitle className="text-zinc-200">Incident Narrative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{caseData.description || "No detailed description was provided for this incident."}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="mt-6 w-full">
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 bg-zinc-900/20">
              <div>
                <CardTitle className="text-zinc-200">Digital Artifacts</CardTitle>
                <CardDescription className="text-zinc-400 mt-1.5">Upload and parse CDRs, IPDRs, Bank statements, etc.</CardDescription>
              </div>
              {canEdit && <EvidenceUpload caseId={caseId} />}
            </CardHeader>
            <CardContent className="w-full">
              {caseData.evidence.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-zinc-800/70 rounded-xl bg-zinc-900/20">
                  <FileBox className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-300">No Evidence Uploaded</h3>
                  <p className="text-zinc-500 mt-2 text-sm max-w-md mx-auto">
                    Upload raw data files (CSV, PDF, TXT) here. The system will automatically parse and correlate entities based on the SIH framework.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {caseData.evidence.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors">
                      <div className="flex items-center gap-4 truncate">
                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-400 shadow-sm">
                          <FileBox className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-zinc-200 truncate">{item.fileName}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-[10px] px-1.5 py-0">
                              {item.evidenceType}
                            </Badge>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.fileUrl && item.fileUrl !== 'mock' ? (
                          <>
                            <a href={item.fileUrl} target="_blank" rel="noreferrer">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" title="View File">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </a>
                            {/* Adding fl_attachment via Cloudinary URL triggers a forced download */}
                            <a href={item.fileUrl.replace('/upload/', '/upload/fl_attachment/')} download>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Download File">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          </>
                        ) : (
                          <span className="text-xs text-zinc-600 px-2">No File</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="mt-6 w-full">
          <Card className="bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-2xl overflow-hidden mt-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/[0.02] p-6">
              <div>
                <CardTitle className="text-zinc-200">Extracted Entities</CardTitle>
                <CardDescription className="text-zinc-400 mt-1.5">Phone numbers, IPs, and accounts identified across all evidence.</CardDescription>
              </div>
              {canEdit && <AddEntitySheet caseId={caseId} />}
            </CardHeader>
            <CardContent className="p-0">
              {caseData.caseEntities.length === 0 ? (
                <div className="text-center py-16">
                  <div className="p-4 bg-white/5 rounded-full border border-white/10 w-fit mx-auto mb-4">
                    <Users className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300">No Entities Found</h3>
                  <p className="text-zinc-500 mt-2 text-sm max-w-md mx-auto">
                    Entities will appear here once evidence is uploaded and processed by the parser.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Value / Identifier</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider">Extracted On</th>
                        <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {caseData.caseEntities.map(ce => (
                        <tr key={ce.id} className="hover:bg-white/[0.03] transition-all duration-300 group">
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`
                              text-[10px] uppercase tracking-wider font-bold px-2 py-0.5
                              ${ce.entity.type === 'PHONE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                ce.entity.type === 'IP_ADDRESS' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                                  ce.entity.type === 'BANK_ACCOUNT' || ce.entity.type === 'UPI' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                    'bg-white/5 text-zinc-400 border-white/10'}
                            `}>
                              {ce.entity.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`
                              text-[10px] uppercase tracking-wider font-bold px-2 py-0.5
                              ${ce.role === 'SUSPECT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]' :
                                ce.role === 'VICTIM' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                  ce.role === 'WITNESS' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                                    'bg-white/5 text-zinc-400 border-white/10'}
                            `}>
                              {ce.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-zinc-200 group-hover:text-white transition-colors">{ce.entity.value}</td>
                          <td className="px-6 py-4 text-zinc-500">{new Date(ce.entity.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                            <InvestigateLinkagesSheet entity={ce.entity} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TIMELINE TAB */}
        <TabsContent value="timeline" className="mt-6 w-full">
          <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/50 bg-zinc-900/20">
              <div>
                <CardTitle className="text-zinc-200">Investigation Timeline</CardTitle>
                <CardDescription className="text-zinc-400 mt-1.5">Chronological history of case events and automated AI findings.</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300">
                + Add Log Entry
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {caseData.events.length === 0 && caseData.findings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-zinc-300">No Timeline Events</h3>
                  <p className="text-zinc-500 mt-2 text-sm max-w-md mx-auto">
                    Events, automated analysis logs, and manual investigation notes will appear here in chronological order.
                  </p>
                </div>
              ) : (
                <div className="relative border-l border-zinc-800 ml-6 space-y-8 pb-4">
                  {[...caseData.events, ...caseData.findings].sort((a: any, b: any) => new Date(a.timestamp || a.createdAt).getTime() - new Date(b.timestamp || b.createdAt).getTime()).map((item: any, i: number) => {
                    const isEvent = !!item.eventType;
                    const date = isEvent ? item.timestamp : item.createdAt;

                    let colorClass = "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]";
                    let titleColor = "text-zinc-200";
                    let title = "";
                    let description = item.description;

                    if (isEvent) {
                      if (item.eventType === 'ENTITY_ADDED') {
                        colorClass = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]";
                      }
                      title = item.eventType.replace('_', ' ');
                    } else {
                      colorClass = "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse";
                      titleColor = "text-orange-400";
                      title = item.title;
                    }

                    return (
                      <div key={item.id} className="relative pl-8 animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-zinc-500">{new Date(date).toLocaleString()}</span>
                          <h4 className={`text-sm font-medium ${titleColor}`}>{title}</h4>
                          <p className="text-sm text-zinc-400 whitespace-pre-wrap">{description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
