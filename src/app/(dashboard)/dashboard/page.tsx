import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, AlertTriangle, FileBox, Users } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [activeCases, highRiskCases, evidenceCount, entityCount, recentCases] = await Promise.all([
    prisma.case.count({ where: { status: 'ACTIVE' } }),
    prisma.case.count({ where: { priority: 'HIGH' } }),
    prisma.evidence.count(),
    prisma.entity.count(),
    prisma.case.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, caseNumber: true, title: true, createdAt: true, priority: true }
    })
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Overview</h1>
        <p className="text-zinc-400 mt-1">Platform statistics and recent investigation activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Active Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{activeCases}</div>
            <p className="text-xs text-zinc-500 mt-1">Total open investigations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">High-Risk Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{highRiskCases}</div>
            <p className="text-xs text-zinc-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Evidence Files</CardTitle>
            <FileBox className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{evidenceCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Documents and artifacts</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">Correlated Entities</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{entityCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Extracted unique data points</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-200">Investigation Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-md">
              [Activity Chart Placeholder]
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-200">Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCases.map((item) => (
                <Link href={`/cases/${item.id}`} key={item.id} className="flex items-center justify-between border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0 hover:bg-zinc-900/40 p-2 rounded-md transition-colors group">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">{item.caseNumber}</p>
                      {item.priority === 'HIGH' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[200px]">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                </Link>
              ))}
              {recentCases.length === 0 && (
                <p className="text-zinc-500 text-sm text-center py-4">No cases found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
