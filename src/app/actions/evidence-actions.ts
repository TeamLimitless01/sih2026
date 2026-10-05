"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, EntityType } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";
import * as pdfParseModule from "pdf-parse";
import { prisma } from "@/lib/prisma";

const pollinations = new OpenAI({
  apiKey: "sk_EAH7ZUybK4BpBtT4q2KEltJks5uxzZZX",
  baseURL: "https://gen.pollinations.ai/v1"
});

export async function processUploadedEvidence(caseId: string, fileData: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const fileName = fileData.original_filename || "unknown_file";
  const fileUrl = fileData.secure_url;
  
  const rawFormat = (fileData.format || "unknown").toLowerCase();
  const fileType = ["jpg", "jpeg", "png", "webp", "gif"].includes(rawFormat) 
    ? `image/${rawFormat}` 
    : rawFormat;

  try {
    // 1. Create Evidence Record
    const evidence = await prisma.evidence.create({
      data: {
        caseId,
        fileName,
        fileUrl,
        fileType,
        evidenceType: fileName.toLowerCase().includes("cdr") ? "CDR" :
          fileName.toLowerCase().includes("bank") ? "Bank Statement" :
            fileName.toLowerCase().includes("ip") ? "IPDR" : "Document",
        processingStatus: "COMPLETED", // Completed synchronously for now
        uploadedBy: session.user.name || "Unknown",
      }
    });

    // 2. Perform Real AI Analysis (Extraction + Summary)
    let summaryText = "Uploaded new evidence document.";
    let extractedData: { type: any, value: string, role?: string }[] = [];

    try {
      let fileContent = "";
      let messages: any[] = [];
      const isImage = fileType.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif"].includes(fileType.toLowerCase());

      if (isImage) {
        messages = [
          {
            role: "user", content: [
              { type: "text", text: "Analyze this image evidence. Extract any relevant phone numbers, emails, IP addresses, bank accounts, UPI IDs, crypto addresses, or people names. For each entity, deduce its role (SUSPECT, VICTIM, WITNESS, or UNKNOWN). Also provide a 1-2 sentence summary. Return JSON exactly in this format: { \"summary\": \"...\", \"entities\": [ { \"type\": \"PHONE\"|\"EMAIL\"|\"IP_ADDRESS\"|\"BANK_ACCOUNT\"|\"UPI\"|\"CRYPTO_ADDRESS\"|\"PERSON\"|\"IMEI\", \"value\": \"...\", \"role\": \"SUSPECT\"|\"VICTIM\"|\"WITNESS\"|\"UNKNOWN\" } ] }" },
              { type: "image_url", image_url: { url: fileUrl } }
            ]
          }
        ];
      } else {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        if (fileType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
          const pdfParse = (pdfParseModule as any).default || pdfParseModule;
          const pdfData = await pdfParse(Buffer.from(arrayBuffer));
          fileContent = pdfData.text.substring(0, 15000);
        } else {
          fileContent = Buffer.from(arrayBuffer).toString('utf-8').substring(0, 15000);
        }

        messages = [
          { role: "user", content: `Analyze this evidence document (${fileName}). Extract any relevant phone numbers, emails, IP addresses, bank accounts, UPI IDs, crypto addresses, or people names. For each entity, deduce its role (SUSPECT, VICTIM, WITNESS, or UNKNOWN). Also provide a 1-2 sentence summary. Return JSON exactly in this format: { "summary": "...", "entities": [ { "type": "PHONE"|"EMAIL"|"IP_ADDRESS"|"BANK_ACCOUNT"|"UPI"|"CRYPTO_ADDRESS"|"PERSON"|"IMEI", "value": "...", "role": "SUSPECT"|"VICTIM"|"WITNESS"|"UNKNOWN" } ] }\n\nContent:\n${fileContent}` }
        ];
      }

      const aiRes = await pollinations.chat.completions.create({
        model: "openai/gpt-6-luna",
        messages,
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(aiRes.choices[0].message.content || '{"summary":"","entities":[]}');
      summaryText = parsed.summary || "Document uploaded.";

      const validTypes = ["PHONE", "EMAIL", "IP_ADDRESS", "BANK_ACCOUNT", "UPI", "CRYPTO_ADDRESS", "PERSON", "IMEI"];
      if (Array.isArray(parsed.entities)) {
        extractedData = parsed.entities.filter((e: any) => validTypes.includes(e.type) && e.value);
      }
    } catch (err) {
      console.error("AI Analysis failed", err);
    }

    // 3. Save Extracted Entities to Database
    for (const data of extractedData) {
      const entity = await prisma.entity.upsert({
        where: { normalizedValue: data.value },
        update: {},
        create: {
          type: data.type,
          value: data.value,
          normalizedValue: data.value,
        }
      });

      await prisma.caseEntity.upsert({
        where: { caseId_entityId: { caseId, entityId: entity.id } },
        update: { role: (data.role as any) || 'UNKNOWN' },
        create: { caseId, entityId: entity.id, role: (data.role as any) || 'UNKNOWN' }
      });

      await prisma.evidenceEntity.upsert({
        where: { evidenceId_entityId: { evidenceId: evidence.id, entityId: entity.id } },
        update: {},
        create: { evidenceId: evidence.id, entityId: entity.id }
      });
    }

    // 4. Save to Timeline
    await prisma.investigationEvent.create({
      data: {
        caseId,
        eventType: "EVIDENCE_UPLOAD",
        timestamp: new Date(),
        description: `**Evidence Uploaded:** ${fileName}\n\n**AI Analysis:** ${summaryText}\n\n*Extracted ${extractedData.length} entities.*`,
        metadata: { evidenceId: evidence.id, fileType }
      }
    });

    revalidatePath(`/cases/${caseId}`);
    return { success: true, evidenceId: evidence.id, extractedCount: extractedData.length };
  } catch (error) {
    console.error("Error processing evidence:", error);
    return { success: false, error: "Failed to process evidence" };
  }
}
