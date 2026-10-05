"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCase } from "@/app/actions/case-actions";
import { toast } from "sonner";

export default function NewCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createCase(formData);
    
    if (result.success) {
      toast.success("Case created successfully");
      router.push("/cases");
    } else {
      toast.error(result.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/cases" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 px-4 py-2 text-zinc-400 hover:text-zinc-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cases
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Initialize New Case</h1>
          <p className="text-zinc-400 mt-1">Enter initial details for the cyber fraud investigation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-200">Case Details</CardTitle>
            <CardDescription className="text-zinc-400">Core information regarding the reported fraud.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-zinc-300">Case Title *</Label>
                <Input id="title" name="title" required placeholder="e.g. UPI Investment Scam - Telegram" className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fraudType" className="text-zinc-300">Fraud Category *</Label>
                <Select name="fraudType" required defaultValue="UPI Fraud">
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectItem value="UPI Fraud">UPI Fraud</SelectItem>
                    <SelectItem value="Telecom Fraud">Telecom / SIM Swap</SelectItem>
                    <SelectItem value="Phishing">Phishing / Vishing</SelectItem>
                    <SelectItem value="Crypto">Cryptocurrency Scam</SelectItem>
                    <SelectItem value="Identity Theft">Identity Theft</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-300">Incident Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Detailed explanation of how the fraud occurred..." 
                className="min-h-[100px] bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="victimName" className="text-zinc-300">Victim Name</Label>
                <Input id="victimName" name="victimName" placeholder="Full Name" className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="victimPhone" className="text-zinc-300">Victim Contact</Label>
                <Input id="victimPhone" name="victimPhone" placeholder="+91..." className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fraudAmount" className="text-zinc-300">Defrauded Amount (₹)</Label>
                <Input id="fraudAmount" name="fraudAmount" type="number" min="0" step="0.01" placeholder="0.00" className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDate" className="text-zinc-300">Date of Incident</Label>
                <Input id="incidentDate" name="incidentDate" type="date" className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100 [color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-zinc-300">Jurisdiction / Location</Label>
                <Input id="location" name="location" placeholder="e.g. Cyber Cell, Mumbai" className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-zinc-300">Priority Level *</Label>
                <Select name="priority" required defaultValue="MEDIUM">
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 focus-visible:ring-blue-500 text-zinc-100">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical (Immediate Action)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Initialize Case"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
