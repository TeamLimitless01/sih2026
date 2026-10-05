"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addEntityAction } from "@/app/actions/case-actions";
import { Users } from "lucide-react";

export function AddEntitySheet({ caseId }: { caseId: string }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await addEntityAction(caseId, formData);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Users className="w-4 h-4 mr-2" /> Add Entity
        </Button>
      } />
      <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-200">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Manual Entity Entry</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Log a known identifier related to this investigation. The system will automatically check for cross-case links.
          </SheetDescription>
        </SheetHeader>
        <form action={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="type">Entity Type</Label>
            <select name="type" id="type" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm">
              <option value="PERSON">Person Name</option>
              <option value="PHONE">Phone Number</option>
              <option value="IP_ADDRESS">IP Address</option>
              <option value="BANK_ACCOUNT">Bank Account</option>
              <option value="UPI">UPI ID</option>
              <option value="EMAIL">Email Address</option>
              <option value="IMEI">IMEI Number</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role in Case</Label>
            <select name="role" id="role" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2 text-sm">
              <option value="UNKNOWN">Unknown / Unverified</option>
              <option value="SUSPECT">Suspect / Malicious</option>
              <option value="VICTIM">Victim</option>
              <option value="WITNESS">Witness</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">Value / Identifier</Label>
            <Input id="value" name="value" placeholder="e.g. +919876543210" required className="bg-zinc-900 border-zinc-800 font-mono" />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Add to Case</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
