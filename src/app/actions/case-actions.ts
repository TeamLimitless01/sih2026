"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import * as pdfParseModule from "pdf-parse";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const pollinations = new OpenAI({
  apiKey: "sk_EAH7ZUybK4BpBtT4q2KEltJks5uxzZZX",
  baseURL: "https://gen.pollinations.ai/v1"
});

export async function updateCaseAction(caseId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INVESTIGATOR")) {
    throw new Error("Unauthorized: Only Admins and Investigators can update cases.");
  }

  const status = formData.get("status") as any;
  const priority = formData.get("priority") as any;
  const description = formData.get("description") as string;
  const fraudAmount = Number(formData.get("fraudAmount"));

  await prisma.case.update({
    where: { id: caseId },
    data: {
      status,
      priority,
      description,
      fraudAmount: isNaN(fraudAmount) ? undefined : fraudAmount,
    }
  });

  // Log a timeline event!
  await prisma.investigationEvent.create({
    data: {
      caseId,
      eventType: "CASE_UPDATED",
      timestamp: new Date(),
      description: "Investigator updated case metadata.",
    }
  });

  revalidatePath(`/cases/${caseId}`);
}

export async function addEntityAction(caseId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INVESTIGATOR")) {
    throw new Error("Unauthorized: Only Admins and Investigators can add entities.");
  }

  const type = formData.get("type") as any;
  const role = (formData.get("role") || "UNKNOWN") as any;
  const value = formData.get("value") as string;

  if (!value) return;

  const normalizedValue = value.replace(/\s+/g, '').toUpperCase();

  // Find or create the entity
  let entity = await prisma.entity.findUnique({
    where: { normalizedValue }
  });

  if (!entity) {
    entity = await prisma.entity.create({
      data: {
        type,
        value,
        normalizedValue,
      }
    });
  }

  // Link to case
  await prisma.caseEntity.upsert({
    where: {
      caseId_entityId: {
        caseId,
        entityId: entity.id
      }
    },
    update: {
      role
    },
    create: {
      caseId,
      entityId: entity.id,
      role
    }
  });

  // Log a timeline event!
  await prisma.investigationEvent.create({
    data: {
      caseId,
      entityId: entity.id,
      eventType: "ENTITY_ADDED",
      timestamp: new Date(),
      description: `Investigator manually logged a ${type}: ${value}`,
    }
  });

  revalidatePath(`/cases/${caseId}`);
}

export async function generateAIAnalysisAction(caseId: string) {
  // Fetch full context for the AI
  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      caseEntities: { include: { entity: true } },
      evidence: true
    }
  });

  if (!caseData) return;

  const entitySummary = caseData.caseEntities.map(ce => `${ce.entity.type}: ${ce.entity.value}`).join(', ');

  // Fetch and parse evidence documents
  let evidenceText = "";
  const imageUrls: string[] = [];

  for (const doc of caseData.evidence) {
    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
      try {
        if (doc.fileType.startsWith('image/')) {
          imageUrls.push(doc.fileUrl);
          continue;
        }

        const response = await fetch(doc.fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        if (doc.fileType === 'application/pdf' || doc.fileName.endsWith('.pdf')) {
          const pdfParse = (pdfParseModule as any).default || pdfParseModule;
          const pdfData = await pdfParse(Buffer.from(arrayBuffer));
          evidenceText += `\n--- Document: ${doc.fileName} ---\n${pdfData.text.substring(0, 5000)}\n`;
        } else if (doc.fileType.startsWith('text/') || doc.fileName.endsWith('.csv') || doc.fileName.endsWith('.txt')) {
          const text = Buffer.from(arrayBuffer).toString('utf-8');
          evidenceText += `\n--- Document: ${doc.fileName} ---\n${text.substring(0, 5000)}\n`;
        } else {
          evidenceText += `\n--- Document: ${doc.fileName} ---\n[Binary file omitted from text analysis]\n`;
        }
      } catch (err) {
        console.error(`Failed to parse document ${doc.fileName}:`, err);
      }
    }
  }

  const prompt = `
  You are an expert Cyber Crime Investigator AI. Analyze the following fraud case and provide a structured tactical briefing. 
  
  Format your response clearly using exactly these three headings (do not use markdown formatting like asterisks or hash tags, just plain text with newlines):
  
  KEY INSIGHTS:
  (Provide 2-3 brief insights here)
  
  CRITICAL CLUES:
  (List 2-3 specific clues or entities of interest)
  
  SUGGESTED ACTIONS:
  (List 2-3 actionable next steps for the human investigator)
  
  Case: ${caseData.caseNumber} - ${caseData.title}
  Type: ${caseData.fraudType}
  Amount: ₹${caseData.fraudAmount}
  Entities Found: ${entitySummary || 'None'}
  Description: ${caseData.description}
  
  EVIDENCE DOCUMENTS RAW TEXT (Truncated):
  ${evidenceText || 'No parseable document text available.'}
  `;

  try {
    const userContent: any[] = [{ type: "text", text: prompt }];

    // Add all uploaded images for the vision model to analyze
    for (const url of imageUrls) {
      userContent.push({ type: "image_url", image_url: { url } });
    }

    // Pollinations AI uses openai compatible API.
    const response = await pollinations.chat.completions.create({
      model: "openai/gpt-6-luna",
      messages: [{ role: "user", content: userContent }]
    });

    const analysis = response.choices[0].message.content || "No analysis generated.";

    // Save as a high severity finding
    await prisma.finding.create({
      data: {
        caseId,
        type: "AI_ANALYSIS",
        severity: "CRITICAL",
        title: "AI Insights",
        description: analysis,
        score: 95
      }
    });

    revalidatePath(`/cases/${caseId}`);
  } catch (error) {
    console.error("AI Error:", error);
  }
}

export async function createCase(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "INVESTIGATOR")) {
      return { success: false, error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const fraudType = formData.get("fraudType") as string;
    const description = formData.get("description") as string;
    const victimName = formData.get("victimName") as string;
    const victimPhone = formData.get("victimPhone") as string;
    const fraudAmountStr = formData.get("fraudAmount") as string;
    const incidentDateStr = formData.get("incidentDate") as string;
    const location = formData.get("location") as string;
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

    // Generate unique case number
    const count = await prisma.case.count();
    const caseNumber = `CASE-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        title,
        fraudType,
        description,
        victimName,
        victimPhone,
        fraudAmount: fraudAmountStr ? parseFloat(fraudAmountStr) : undefined,
        incidentDate: incidentDateStr ? new Date(incidentDateStr) : undefined,
        location,
        priority: priority || "MEDIUM",
        status: "ACTIVE",
        createdById: session.user.id,
      },
    });

    await prisma.investigationEvent.create({
      data: {
        caseId: newCase.id,
        eventType: "CASE_CREATED",
        timestamp: new Date(),
        description: `Case initialized by investigator.`,
      }
    });

    revalidatePath("/cases");
    return { success: true, caseId: newCase.id };
  } catch (error: any) {
    console.error("Failed to create case:", error);
    return { success: false, error: error.message || "Failed to create case" };
  }
}
