import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { PrintButton } from "./print-button";

export default async function PrintReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const caseId = resolvedParams.id;

  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      createdBy: true,
      caseEntities: {
        include: {
          entity: true
        }
      },
      events: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  if (!caseData) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen text-black font-sans p-8 md:p-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Cyber Investigation Report</h1>
            <p className="text-sm text-gray-500 font-medium">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold font-mono">{caseData.caseNumber}</h2>
          <p className="text-sm font-semibold mt-1">Status: {caseData.status}</p>
          <p className="text-sm">Priority: {caseData.priority}</p>
        </div>
      </div>

      <PrintButton />

      {/* Overview */}
      <section className="mb-10">
        <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">1. Case Overview</h3>
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-6 bg-gray-50 p-4 rounded border border-gray-200">
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Title</span>{caseData.title}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Fraud Type</span>{caseData.fraudType}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Victim Name</span>{caseData.victimName || "N/A"}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Victim Phone</span>{caseData.victimPhone || "N/A"}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Defrauded Amount</span>{caseData.fraudAmount ? `₹${caseData.fraudAmount.toLocaleString('en-IN')}` : "N/A"}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Jurisdiction</span>{caseData.location || "N/A"}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Incident Date</span>{caseData.incidentDate ? new Date(caseData.incidentDate).toLocaleDateString() : "N/A"}</div>
          <div><span className="font-semibold text-gray-600 block text-xs uppercase">Investigating Officer</span>{caseData.createdBy.name}</div>
        </div>
        <div className="text-sm leading-relaxed">
          <span className="font-semibold text-gray-600 block text-xs uppercase mb-2">Incident Narrative</span>
          <p className="whitespace-pre-wrap">{caseData.description || "No narrative provided."}</p>
        </div>
      </section>

      {/* Extracted Entities */}
      <section className="mb-10 page-break-inside-avoid">
        <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">2. Extracted Cyber Entities</h3>
        {caseData.caseEntities.length === 0 ? (
          <p className="text-sm italic text-gray-500">No entities extracted for this case.</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y border-gray-300">
                <th className="py-2 px-4 font-semibold uppercase text-xs">Type</th>
                <th className="py-2 px-4 font-semibold uppercase text-xs">Identifier / Value</th>
                <th className="py-2 px-4 font-semibold uppercase text-xs">Extracted On</th>
              </tr>
            </thead>
            <tbody>
              {caseData.caseEntities.map(ce => (
                <tr key={ce.id} className="border-b border-gray-200">
                  <td className="py-2 px-4 font-medium">{ce.entity.type}</td>
                  <td className="py-2 px-4 font-mono">{ce.entity.value}</td>
                  <td className="py-2 px-4 text-gray-600">{new Date(ce.entity.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Timeline */}
      <section className="page-break-inside-avoid">
        <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 uppercase tracking-wider">3. Event Timeline</h3>
        {caseData.events.length === 0 ? (
          <p className="text-sm italic text-gray-500">No events recorded.</p>
        ) : (
          <div className="space-y-4">
            {caseData.events.map(event => (
              <div key={event.id} className="flex gap-4">
                <div className="w-32 shrink-0 text-sm font-semibold text-gray-600">
                  {new Date(event.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{event.eventType.replace(/_/g, ' ')}</h4>
                  <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-300 text-center text-xs text-gray-400 print:fixed print:bottom-4 print:left-0 print:w-full print:border-none">
        CONFIDENTIAL - INTERNAL LAW ENFORCEMENT USE ONLY. GENERATED BY CYBERFORENSICS PLATFORM.
      </div>
    </div>
  );
}
