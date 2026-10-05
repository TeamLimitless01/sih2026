"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { processUploadedEvidence } from "@/app/actions/evidence-actions";

export function EvidenceUpload({ caseId }: { caseId: string }) {
  const router = useRouter();

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary/sign"
      options={{
        multiple: true,
        maxFiles: 10,
        sources: ["local", "url"],
      }}
      onSuccess={async (result) => {
        if (result.info && typeof result.info === 'object') {
          const toastId = toast.loading(`Processing ${result.info.original_filename}...`);
          
          const res = await processUploadedEvidence(caseId, result.info);
          
          if (res.success) {
            toast.success(`Uploaded and parsed! Extracted ${res.extractedCount} entities.`, { id: toastId });
            router.refresh();
          } else {
            toast.error("Upload succeeded, but processing failed.", { id: toastId });
          }
        }
      }}
      onError={(error) => {
        console.error("Upload error:", error);
        toast.error("Failed to upload evidence");
      }}
    >
      {({ open }) => (
        <Button
          onClick={() => open()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Evidence
        </Button>
      )}
    </CldUploadWidget>
  );
}
