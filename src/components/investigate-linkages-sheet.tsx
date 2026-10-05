"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Network, Link as LinkIcon, Phone, Mail, Globe, Landmark, Hash, User, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function InvestigateLinkagesSheet({ entity }: { entity: any }) {
  // Extract all cases this entity is linked to from the nested data
  const linkedCases = entity.caseEntities?.map((ce: any) => ce.case) || [];

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'PHONE': return <Phone className="w-5 h-5" />;
      case 'EMAIL': return <Mail className="w-5 h-5" />;
      case 'IP_ADDRESS': return <Globe className="w-5 h-5" />;
      case 'BANK_ACCOUNT':
      case 'CRYPTO_ADDRESS': return <Landmark className="w-5 h-5" />;
      case 'UPI': return <Hash className="w-5 h-5" />;
      case 'PERSON': return <User className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="ghost" size="sm" className="h-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
          <Network className="w-3.5 h-3.5 mr-1.5" />
          Investigate Linkages ({linkedCases.length})
        </Button>
      } />
      <SheetContent className="bg-zinc-950 border-zinc-800 text-zinc-200 w-full md:max-w-md p-0 flex flex-col h-full">
        <div className="p-6 border-b border-zinc-800">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                {getEntityIcon(entity.type)}
              </div>
              <div>
                <SheetTitle className="text-zinc-100 flex items-center gap-2">
                  {entity.value}
                </SheetTitle>
                <SheetDescription className="text-zinc-400">
                  <Badge variant="outline" className="bg-zinc-900 border-zinc-700 mt-1">{entity.type}</Badge>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Cross-Case Correlator
              </h3>
              
              {linkedCases.length <= 1 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
                  <Network className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">This entity is currently isolated to the present case.</p>
                  <p className="text-xs text-zinc-500 mt-1">If it appears in future cases, linkages will automatically map here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">
                    Found in {linkedCases.length} cases
                  </p>
                  {linkedCases.map((c: any) => (
                    <Link key={c.id} href={`/cases/${c.id}`} className="block">
                      <div className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs font-semibold text-blue-400">{c.caseNumber}</span>
                          <Badge variant="outline" className="text-[10px] py-0 bg-zinc-950 border-zinc-800 text-zinc-500">
                            {c.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm text-zinc-200 line-clamp-1">{c.title}</h4>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{c.fraudType} • {c.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
