"use client";

import { useState, useMemo } from "react";
import { Network, Link as LinkIcon, Phone, Mail, Globe, Landmark, Hash, User, ShieldAlert, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Entity = {
  id: string;
  type: string;
  value: string;
  createdAt: Date;
  caseEntities: {
    case: {
      id: string;
      caseNumber: string;
      title: string;
    }
  }[];
};

export function NetworkClient({ initialEntities }: { initialEntities: Entity[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>("ALL");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntities = useMemo(() => {
    return initialEntities.filter(entity => {
      const matchesSearch = entity.value.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" || entity.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [initialEntities, search, typeFilter]);

  const paginatedEntities = filteredEntities.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'PHONE': return <Phone className="w-4 h-4" />;
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'IP_ADDRESS': return <Globe className="w-4 h-4" />;
      case 'BANK_ACCOUNT':
      case 'CRYPTO_ADDRESS': return <Landmark className="w-4 h-4" />;
      case 'UPI': return <Hash className="w-4 h-4" />;
      case 'PERSON': return <User className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search entities (e.g. 987654...)" 
            className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-200 w-full"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="All Types" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="PHONE">Phone</SelectItem>
              <SelectItem value="IP_ADDRESS">IP Address</SelectItem>
              <SelectItem value="BANK_ACCOUNT">Bank Account</SelectItem>
              <SelectItem value="UPI">UPI ID</SelectItem>
              <SelectItem value="EMAIL">Email</SelectItem>
              <SelectItem value="CRYPTO_ADDRESS">Crypto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-zinc-950 border-zinc-800 shadow-xl">
        <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-zinc-200 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Repeat Offenders & Shared Infrastructure
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                Showing {filteredEntities.length} highly-connected entities.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEntities.length === 0 ? (
            <div className="p-12 text-center">
              <Network className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-300">No matching entities found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {paginatedEntities.map(entity => (
                <div key={entity.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-zinc-900/20 transition-colors">
                  
                  {/* Entity Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                      {getEntityIcon(entity.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium text-zinc-200">{entity.value}</h4>
                        <Badge variant="outline" className="bg-zinc-800/50 text-zinc-400 border-zinc-700">
                          {entity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 mt-1">
                        First seen {new Date(entity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Linked Cases */}
                  <div className="flex-1 max-w-xl">
                    <h5 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Linked Cases ({entity.caseEntities.length})</h5>
                    <div className="flex flex-wrap gap-2">
                      {entity.caseEntities.map(ce => (
                        <Link key={ce.case.id} href={`/cases/${ce.case.id}`}>
                          <Badge variant="outline" className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700 transition-colors py-1 px-3">
                            <span className="font-mono text-blue-400 mr-2">{ce.case.caseNumber}</span>
                            {ce.case.title}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded disabled:opacity-50 hover:bg-zinc-800 text-sm font-medium transition-colors"
          >
            Previous
          </button>
          <span className="text-zinc-500 text-sm">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded disabled:opacity-50 hover:bg-zinc-800 text-sm font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
