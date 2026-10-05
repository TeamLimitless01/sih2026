"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateAIAnalysisAction } from "@/app/actions/case-actions";
import { Sparkles } from "lucide-react";

export function GenerateAIButton({ caseId }: { caseId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    await generateAIAnalysisAction(caseId);
    setLoading(false);
  }

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={loading}
      className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
    >
      <Sparkles className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? "Analyzing..." : "Generate AI Insights"}
    </Button>
  );
}
