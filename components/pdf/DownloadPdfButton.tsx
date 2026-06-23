"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DownloadPdfButtonProps {
  analysisId: string;
}

export function DownloadPdfButton({ analysisId }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating professional PDF report...");

    try {
      const response = await fetch(`/api/pdf/${analysisId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Extract filename from headers if possible, or fallback
      let filename = `Resume_Analysis_${new Date().toISOString().split("T")[0]}.pdf`;
      const disposition = response.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const matches = /filename="([^"]*)"/.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF Downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error("Error", {
        id: toastId,
        description: "Could not generate PDF. Please try again later.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant="outline"
      className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 text-primary"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isGenerating ? "Generating..." : "Download Report"}
    </Button>
  );
}
