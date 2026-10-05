"use server";

import { PrismaClient } from "@prisma/client";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as pdfParseModule from "pdf-parse";
import { prisma } from "@/lib/prisma";

// Configure the LLM to use Pollinations AI API
const llm = new ChatOpenAI({
  apiKey: "sk_EAH7ZUybK4BpBtT4q2KEltJks5uxzZZX",
  configuration: {
    baseURL: "https://gen.pollinations.ai/v1"
  },
  modelName: "openai/gpt-6-luna",
  temperature: 0,
});

// Define the Tools for the Agent
const getCaseDetailsTool = tool(
  async ({ caseId }) => {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { caseEntities: { include: { entity: true } } }
    });
    if (!caseData) return "Case not found.";

    const entitySummary = caseData.caseEntities.map(ce => `${ce.entity.type}: ${ce.entity.value}`).join(', ');

    return JSON.stringify({
      caseNumber: caseData.caseNumber,
      title: caseData.title,
      description: caseData.description,
      fraudType: caseData.fraudType,
      fraudAmount: caseData.fraudAmount,
      status: caseData.status,
      priority: caseData.priority,
      extractedEntities: entitySummary
    }, null, 2);
  },
  {
    name: "get_case_details",
    description: "Fetches the basic summary, description, and list of extracted entities for the current case.",
    schema: z.object({
      caseId: z.string().describe("The UUID of the case")
    })
  }
);

const listEvidenceFilesTool = tool(
  async ({ caseId }) => {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: { evidence: true }
    });
    if (!caseData || caseData.evidence.length === 0) return "No evidence files attached to this case.";

    const fileList = caseData.evidence.map(e => ({
      id: e.id,
      fileName: e.fileName,
      fileType: e.fileType,
      evidenceType: e.evidenceType
    }));

    return JSON.stringify(fileList, null, 2);
  },
  {
    name: "list_evidence_files",
    description: "Lists all evidence files uploaded to the case along with their IDs and file types.",
    schema: z.object({
      caseId: z.string().describe("The UUID of the case")
    })
  }
);

const readEvidenceFileTool = tool(
  async ({ fileId }) => {
    const evidence = await prisma.evidence.findUnique({ where: { id: fileId } });
    if (!evidence || !evidence.fileUrl || evidence.fileUrl === 'mock') {
      return "File not found or no valid URL.";
    }

    try {
      if (evidence.fileType.startsWith('image/')) {
        return `[This is an image file located at ${evidence.fileUrl}. The AI cannot read pixel data here, but it knows the file is attached.]`;
      }

      const response = await fetch(evidence.fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      if (evidence.fileType === 'application/pdf' || evidence.fileName.toLowerCase().endsWith('.pdf')) {
        const pdfParse = (pdfParseModule as any).default || pdfParseModule;
        const pdfData = await pdfParse(Buffer.from(arrayBuffer));
        return `--- CONTENT OF ${evidence.fileName} ---\n${pdfData.text.substring(0, 10000)}`;
      } else {
        // Fallback for CSVs, TXT, and unknown types from Cloudinary (application/octet-stream etc)
        const text = Buffer.from(arrayBuffer).toString('utf-8');
        return `--- CONTENT OF ${evidence.fileName} ---\n${text.substring(0, 10000)}`;
      }
    } catch (err: any) {
      return `Failed to read file: ${err.message}`;
    }
  },
  {
    name: "read_evidence_file",
    description: "Downloads and parses the text content of a specific evidence file (PDF, CSV, TXT) given its ID. Useful for deep diving into specific transaction logs or CDRs.",
    schema: z.object({
      fileId: z.string().describe("The UUID of the evidence file to read")
    })
  }
);

// Initialize the LangGraph Agent
const tools = [getCaseDetailsTool, listEvidenceFilesTool, readEvidenceFileTool];
const agent = createReactAgent({ llm, tools });

export async function chatWithAgentAction(caseId: string, history: any[], userMessage: string) {
  try {
    const systemPrompt = `
You are an expert Cyber Crime Investigator AI Copilot. 
You are currently investigating Case ID: ${caseId}. 
You have access to Tools to query the case details, list evidence files, and read the actual contents of the evidence files.
Do NOT guess information. If asked about the case, use the tools to fetch the exact details.
    `;

    // Map the history to standard format
    // Note: in a production app, we would pass proper BaseMessage objects, 
    // but the prebuilt agent accepts a simple array of role/content objects.
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage }
    ];

    const result = await agent.invoke({ messages });

    // The last message in the state will be the AI's response
    const aiMessage = result.messages[result.messages.length - 1];

    return { success: true, message: aiMessage.content };
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return { success: false, error: error.message };
  }
}
