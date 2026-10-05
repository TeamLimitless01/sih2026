import { prisma } from "@/lib/prisma";
import { FileText, Download, ShieldAlert, TrendingUp, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReportsClient } from "./reports-client";

export default async function ReportsPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: true,
      _count: {
        select: { caseEntities: true, evidence: true }
      }
    }
  });

  const totalFraudAmount = cases.reduce((acc, c) => acc + (c.fraudAmount || 0), 0);
  const activeCases = cases.filter(c => c.status === 'ACTIVE').length;
  const criticalCases = cases.filter(c => c.priority === 'CRITICAL').length;

  return (
    <div className="max-w-none w-full mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          Global Reports & Exports
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Centralized hub for generating case reports, reviewing platform analytics, and bulk-exporting investigation data.
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-zinc-400 text-sm font-medium">Total Cases</CardTitle>
            <Briefcase className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{cases.length}</div>
            <p className="text-xs text-zinc-500 mt-1">{activeCases} currently active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-zinc-400 text-sm font-medium">Critical Priority</CardTitle>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{criticalCases}</div>
            <p className="text-xs text-zinc-500 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-zinc-400 text-sm font-medium">Total Defrauded (INR)</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              ₹{totalFraudAmount >= 10000000 
                ? (totalFraudAmount / 10000000).toFixed(2) + ' Cr' 
                : totalFraudAmount >= 100000 
                  ? (totalFraudAmount / 100000).toFixed(2) + ' L' 
                  : totalFraudAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Platform wide financial loss</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-zinc-400 text-sm font-medium">Total Investigators</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {new Set(cases.map(c => c.createdById)).size}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Active personnel</p>
          </CardContent>
        </Card>
      </div>

      <ReportsClient initialCases={cases as any} />
    </div>
  );
}
