"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateCaseAction } from "@/app/actions/case-actions";
import { Case } from "@prisma/client";

export function EditCaseSheet({ caseData }: { caseData: Case }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await updateCaseAction(caseData.id, formData);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Edit Case Details
        </Button>
      } />
      <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-200">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Edit Case Metadata</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Update the status, priority, or description. This action will be logged in the timeline.
          </SheetDescription>
        </SheetHeader>
        <form action={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select name="status" id="status" defaultValue={caseData.status} className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm">
              <option value="ACTIVE">ACTIVE</option>
              <option value="CLOSED">CLOSED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select name="priority" id="priority" defaultValue={caseData.priority} className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fraudAmount">Fraud Amount (INR)</Label>
            <Input id="fraudAmount" name="fraudAmount" type="number" defaultValue={caseData.fraudAmount || ""} className="bg-zinc-900 border-zinc-800" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Incident Description</Label>
            <Textarea id="description" name="description" defaultValue={caseData.description || ""} rows={6} className="bg-zinc-900 border-zinc-800" />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
