"use server";

import { prisma } from "@/lib/prisma";

export async function performGlobalSearch(query: string) {
  if (!query || query.trim().length < 2) return { cases: [], entities: [] };

  const s = query.trim();
  const searchPattern = `%${s}%`;

  // Prisma doesn't easily support generic OR across completely unrelated tables in one query,
  // so we run parallel targeted queries.

  // 1. Search Cases (by Title, Case Number, Fraud Type, or Victim)
  const cases = await prisma.case.findMany({
    where: {
      OR: [
        { caseNumber: { contains: s, mode: 'insensitive' } },
        { title: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
        { victimName: { contains: s, mode: 'insensitive' } },
        { victimPhone: { contains: s, mode: 'insensitive' } },
        { location: { contains: s, mode: 'insensitive' } }
      ]
    },
    take: 20
  });

  // 2. Search Entities (by Value)
  const entities = await prisma.entity.findMany({
    where: {
      value: { contains: s, mode: 'insensitive' }
    },
    include: {
      caseEntities: {
        include: {
          case: { select: { id: true, caseNumber: true, title: true } }
        }
      }
    },
    take: 30
  });

  return {
    cases,
    entities
  };
}
