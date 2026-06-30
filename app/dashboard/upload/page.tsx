"use client"

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, FileText, CheckCircle2, FileType2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { parseResume, ParseResult } from "@/lib/parser";
import { analyzeResume } from "@/lib/ai";
import { saveAnalysis, checkCache } from "@/lib/actions";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setProgress(0);
        setParseResult(null);
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large", { description: "Maximum file size is 10MB." });
      } else if (error?.code === "file-invalid-type") {
        toast.error("Invalid file type", { description: "Please upload a PDF or DOCX file." });
      } else {
        toast.error("Upload failed", { description: error?.message || "Invalid file." });
      }
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(30); // Show initial progress
    setParseResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(60); // Parsing started

      const result = await parseResume(formData);

      if (!result.success) {
        toast.error("Parsing failed", { description: result.error });
        setProgress(0);
        setIsUploading(false);
        return;
      }

      setProgress(100);
      setParseResult(result);
      toast.success("Resume parsed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error", { description: "An unexpected error occurred during parsing." });
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (forceReanalyze: boolean = false) => {
    if (!parseResult?.text) return;
    
    // Get the job description from the textarea if it exists
    const jobDescElement = document.getElementById("jobDesc") as HTMLTextAreaElement;
    const jobDescription = jobDescElement?.value?.trim() || undefined;
    
    setIsAnalyzing(true);
    const toastId = toast.loading("AI is analyzing your resume...");

    try {
      const { analysisId: cachedId, fingerprint } = await checkCache(parseResult.text, jobDescription);
      
      if (!forceReanalyze && cachedId) {
        toast.dismiss(toastId);
        toast.success("Loaded a previously generated analysis.");
        router.push(`/dashboard/analysis/${cachedId}`);
        return;
      }

      const aiResult = await analyzeResume(parseResult.text, jobDescription);
      
      if (!aiResult.success || !aiResult.data) {
        toast.dismiss(toastId);
        toast.error("Analysis Failed", { description: aiResult.error || "Unknown error occurred." });
        return;
      }

      // Store in database
      const jobTitleElement = document.getElementById("jobTitle") as HTMLInputElement;
      const jobTitle = jobTitleElement?.value?.trim() || "Resume Analysis";

      const analysisId = await saveAnalysis(
        parseResult.text,
        parseResult.fileName || "resume.pdf",
        jobTitle,
        aiResult.data,
        jobDescription,
        fingerprint,
        forceReanalyze
      );
      
      toast.dismiss(toastId);
      toast.success("Analysis Complete!");
      
      // Navigate to specific analysis page
      router.push(`/dashboard/analysis/${analysisId}`);
    } catch (error: unknown) {
      console.error(error);
      let errorMessage = "An unexpected error occurred while generating the analysis.";
      const errString = String(error) || "";
      
      if (errString.includes("429") || errString.includes("RESOURCE_EXHAUSTED") || errString.includes("quota") || errString.includes("Too Many Requests")) {
        errorMessage = "AI analysis is temporarily unavailable because the Gemini API quota has been exceeded. Please try again later.";
      } else if (errString.includes("503") || errString.includes("UNAVAILABLE") || errString.includes("Service Unavailable")) {
        errorMessage = "The AI service is currently experiencing high demand. Please try again in a few minutes.";
      }
      
      toast.dismiss(toastId);
      toast.error("Analysis Error", { description: errorMessage });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Upload Resume</h1>
        <p className="text-muted-foreground mt-2 text-lg">Upload your resume to get instant AI-powered feedback against industry standards.</p>
      </div>

      <Card className="rounded-2xl shadow-sm border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl pb-6">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Target Role
          </CardTitle>
          <CardDescription>Tailor the ATS scoring specifically to the job you want.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label htmlFor="jobTitle" className="font-semibold text-foreground/90">Job Title (Optional)</Label>
            <Input id="jobTitle" placeholder="e.g. Frontend Developer" className="rounded-xl h-11 bg-background" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="jobDesc" className="font-semibold text-foreground/90">Job Description (Optional)</Label>
            <textarea 
              id="jobDesc" 
              className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
              placeholder="Paste the job description here to receive a role-specific ATS match score and personalized recommendations."
            />
            <p className="text-sm text-muted-foreground">Leave blank to receive a general ATS analysis. Add a job description to receive a Job Match Score and personalized AI recommendations.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md border-border/50 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary/10" />
        <CardHeader className="pt-6">
          <CardTitle>Resume File</CardTitle>
          <CardDescription>Upload a PDF or DOCX file (Max 10MB).</CardDescription>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? "border-primary bg-primary/5 scale-[1.02] shadow-sm" : "border-border/60 hover:bg-muted/50 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground pointer-events-none">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors duration-300 ${isDragActive ? "bg-primary/20" : "bg-muted shadow-sm"}`}>
                  <UploadCloud className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {isDragActive ? "Drop your resume here!" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm font-medium">PDF, DOCX (max. 10MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-background to-muted/20 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                    <FileIcon className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {!isUploading && (
                  <Button variant="ghost" size="icon" onClick={() => { setFile(null); setParseResult(null); setProgress(0); }} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {(isUploading || parseResult) && (
                <div className="mt-6 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      {parseResult ? (
                        <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Extraction Complete</>
                      ) : (
                        <><div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" /> Extracting text from document...</>
                      )}
                    </span>
                    <span className="font-bold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500" style={{ width: `${progress}%` }} />
                  </Progress>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/50 bg-muted/10 px-6 py-5">
          <Button variant="ghost" onClick={() => { setFile(null); setParseResult(null); setProgress(0); }} disabled={!file || isUploading} className="rounded-full px-6">
            {parseResult ? "Clear" : "Cancel"}
          </Button>
          {!parseResult ? (
            <Button 
              className="rounded-full h-11 px-8 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              {isUploading ? "Extracting..." : "Extract Text"}
            </Button>
          ) : (
            <Button disabled className="rounded-full h-11 px-8">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Extracted
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Resume Preview */}
      {parseResult && (
        <Card className="rounded-2xl shadow-sm border-border/50 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileType2 className="h-5 w-5 text-primary" /> Resume Preview
            </CardTitle>
            <CardDescription>
              Successfully extracted text from {parseResult.fileName}. 
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">File Name</p>
                <p className="font-semibold truncate" title={parseResult.fileName}>{parseResult.fileName}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">Pages</p>
                <p className="font-semibold">{parseResult.pageCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm font-medium text-muted-foreground mb-1">Characters</p>
                <p className="font-semibold">{parseResult.characterCount.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <p className="text-sm font-medium mb-1 opacity-80">Status</p>
                <p className="font-semibold flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Ready for AI</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/10 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 p-3 bg-muted/50 border-b border-border/60 backdrop-blur-sm z-10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" /> Extracted Raw Text
                </span>
              </div>
              <div className="p-6 pt-14 max-h-[400px] overflow-y-auto font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {parseResult.text}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-border/50 bg-muted/10 px-6 py-5">
            <Button 
              variant="outline"
              onClick={() => handleAnalyze(true)} 
              disabled={isAnalyzing}
              className="rounded-full h-11 px-6 shadow-sm transition-all hover:bg-muted/50"
            >
              Re-analyze with AI
            </Button>
            <Button 
              onClick={() => handleAnalyze(false)} 
              disabled={isAnalyzing}
              className="rounded-full h-11 px-8 shadow-md hover:shadow-lg transition-all group"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4 text-primary-foreground/80 group-hover:text-primary-foreground" /> Generate AI Analysis
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
