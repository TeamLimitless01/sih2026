"use client";

import { useState, useEffect } from "react";
import { Search, Briefcase, Network, Loader2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { performGlobalSearch } from "@/app/actions/search-actions";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GlobalSearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams?.get("q") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{cases: any[], entities: any[]}>({ cases: [], entities: [] });

  // Update query when URL changes
  useEffect(() => {
    const q = searchParams?.get("q");
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute Search
  useEffect(() => {
    async function doSearch() {
      if (debouncedQuery.trim().length < 2) {
        setResults({ cases: [], entities: [] });
        return;
      }
      setIsSearching(true);
      try {
        const data = await performGlobalSearch(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }
    doSearch();
  }, [debouncedQuery]);

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 pb-12 pt-8">
      
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-2">
          <Search className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Global Search</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Scan the entire database instantly. Search for Case IDs, suspect names, phone numbers, IP addresses, or keywords across all case evidence.
        </p>
      </div>

      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isSearching ? <Loader2 className="h-6 w-6 text-blue-500 animate-spin" /> : <Search className="h-6 w-6 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />}
        </div>
        <Input
          type="text"
          className="w-full h-16 pl-14 pr-4 bg-zinc-950 border-2 border-zinc-800 text-lg rounded-2xl shadow-xl focus-visible:ring-0 focus-visible:border-blue-500 transition-all text-white placeholder:text-zinc-600"
          placeholder="e.g., +919876543210, John Doe, TXN-8922..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {debouncedQuery.trim().length >= 2 && !isSearching && results.cases.length === 0 && results.entities.length === 0 && (
        <div className="text-center py-12">
          <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-zinc-300">No results found</h3>
          <p className="text-zinc-500 mt-2">Try adjusting your search terms or checking for typos.</p>
        </div>
      )}

      {/* Case Results */}
      {results.cases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Briefcase className="w-5 h-5 text-blue-400" />
            Matching Cases ({results.cases.length})
          </h2>
          <div className="grid gap-3">
            {results.cases.map(c => (
              <Link key={c.id} href={`/cases/${c.id}`}>
                <Card className="bg-zinc-900/50 hover:bg-zinc-800 border-zinc-800 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm text-blue-400 font-semibold group-hover:underline">{c.caseNumber}</span>
                        <Badge variant="outline" className="text-[10px] py-0 bg-zinc-950 border-zinc-700 text-zinc-400">{c.fraudType}</Badge>
                      </div>
                      <h3 className="text-zinc-200 font-medium">{c.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{c.description}</p>
                    </div>
                    <Badge className={c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}>
                      {c.status}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Entity Results */}
      {results.entities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-2 mt-8">
            <Network className="w-5 h-5 text-amber-400" />
            Matching Entities ({results.entities.length})
          </h2>
          <div className="grid gap-3">
            {results.entities.map((e: any) => (
              <div key={e.id}>
                <Card className="bg-zinc-900/50 border-zinc-800 relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-zinc-950 border-zinc-700 text-zinc-300">
                          {e.type}
                        </Badge>
                        <span className="font-mono text-lg text-amber-400 font-bold tracking-tight">{e.value}</span>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2 block">Found in Cases</span>
                      <div className="flex flex-wrap gap-2">
                        {e.caseEntities.map((ce: any) => (
                          <Link key={ce.case.id} href={`/cases/${ce.case.id}`}>
                            <Badge variant="secondary" className="hover:bg-blue-500/20 hover:text-blue-300 cursor-pointer transition-colors">
                              {ce.case.caseNumber}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      <GlobalSearchContent />
    </Suspense>
  );
}
