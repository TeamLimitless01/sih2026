import { Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { NetworkClient } from "./network-client";

export default async function GlobalNetworkPage() {
  const linkedEntities = await prisma.entity.findMany({
    where: {
      caseEntities: {
        some: {}
      }
    },
    include: {
      caseEntities: {
        include: {
          case: true
        }
      }
    }
  });

  const multiCaseEntities = linkedEntities
    .filter(e => e.caseEntities.length > 1)
    .sort((a, b) => b.caseEntities.length - a.caseEntities.length);

  return (
    <div className="max-w-none w-full mx-auto space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Network className="w-8 h-8 text-blue-500" />
          Global Cross-Case Correlation
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Automatically flags entities (Phone numbers, IPs, Bank Accounts) that appear across multiple unrelated cases, helping you identify organized syndicates and repeat offenders.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-950 border-zinc-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-400 text-sm font-medium">Total Linked Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{multiCaseEntities.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Entities appearing in multiple cases</p>
          </CardContent>
        </Card>
      </div>

      <NetworkClient initialEntities={multiCaseEntities as any} />
    </div>
  );
}
