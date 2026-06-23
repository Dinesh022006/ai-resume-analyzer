"use server";

import PDFParser from "pdf2json";
import mammoth from "mammoth";

export interface ParseResult {
  success: boolean;
  fileName: string;
  pageCount: number;
  characterCount: number;
  text: string;
  error?: string;
}

/**
 * Server Action to parse a resume file (PDF or DOCX).
 * Using a Server Action allows us to use Node.js specific libraries securely on the server.
 */
export async function parseResume(formData: FormData): Promise<ParseResult> {
  try {
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return { success: false, fileName: "", pageCount: 0, characterCount: 0, text: "", error: "No file provided" };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, fileName: file.name, pageCount: 0, characterCount: 0, text: "", error: "File size exceeds 10MB limit" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";
    let pageCount = 1;

    // Handle PDF
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      try {
        const parsed = await new Promise<{ text: string, pages: number }>((resolve, reject) => {
          const pdfParser = new PDFParser(null, true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData instanceof Error ? errData : errData?.parserError || errData));
          pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve({
              text: pdfParser.getRawTextContent(),
              pages: pdfData.Pages ? pdfData.Pages.length : 1
            });
          });
          pdfParser.parseBuffer(buffer);
        });
        
        text = parsed.text;
        pageCount = parsed.pages;
      } catch (err) {
        console.error("PDF Parsing error:", err);
        return { success: false, fileName: file.name, pageCount: 0, characterCount: 0, text: "", error: "Failed to parse PDF. The file might be corrupted or encrypted." };
      }
    } 
    // Handle DOCX
    else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.name.toLowerCase().endsWith(".docx")
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch (err) {
        console.error("DOCX Parsing error:", err);
        return { 
          success: false, 
          fileName: file.name, 
          pageCount: 0, 
          characterCount: 0, 
          text: "", 
          error: "Failed to parse DOCX. The file might be corrupted." 
        };
      }
    } 
    // Unsupported formats
    else {
      return { 
        success: false, 
        fileName: file.name, 
        pageCount: 0, 
        characterCount: 0, 
        text: "", 
        error: "Unsupported file format. Please upload a PDF or DOCX file." 
      };
    }

    // Clean up extracted text
    text = text.trim();

    // Check for empty extraction (e.g. image-only PDF)
    if (!text) {
      return { 
        success: false, 
        fileName: file.name, 
        pageCount, 
        characterCount: 0, 
        text: "", 
        error: "Could not extract any text from the document. The document might be empty or contain only images." 
      };
    }

    return {
      success: true,
      fileName: file.name,
      pageCount,
      characterCount: text.length,
      text
    };
  } catch (error) {
    console.error("Unexpected parsing error:", error);
    return { 
      success: false, 
      fileName: "Unknown", 
      pageCount: 0, 
      characterCount: 0, 
      text: "", 
      error: "An unexpected error occurred during parsing." 
    };
  }
}