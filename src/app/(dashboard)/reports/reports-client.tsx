"use client";

import { useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportsClient({ initialCases }: { initialCases: any[] }) {
  const [search, setSearch] = useState("");

  const filteredCases = useMemo(() => {
    if (!search) return initialCases;
    const s = search.toLowerCase();
    return initialCases.filter(c => 
      c.caseNumber.toLowerCase().includes(s) || 
      c.title.toLowerCase().includes(s) || 
      c.fraudType.toLowerCase().includes(s) ||
      (c.victimName && c.victimName.toLowerCase().includes(s))
    );
  }, [initialCases, search]);

  return (
    <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
      <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-zinc-200">Generate Individual Case Reports</CardTitle>
            <CardDescription className="text-zinc-400 mt-1">Download formatted PDF reports for any case in the system.</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Search by case number, title, or type..." 
              className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            {search ? "No cases match your search." : "No cases available."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Case Number</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Fraud Type</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Entities</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-blue-400">
                      <Link href={`/cases/${c.id}`} className="hover:underline">{c.caseNumber}</Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {c.fraudType}
                      <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{c.title}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {c._count.caseEntities} extracted
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700'
                      }>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/print/${c.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500">
                          <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
