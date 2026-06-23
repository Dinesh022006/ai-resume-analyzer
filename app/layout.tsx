import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AlertTriangle } from "lucide-react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "AI Resume Analyzer | Optimize Your CV for ATS",
  description: "Get actionable AI-driven insights to improve your resume, bypass ATS filters, and land more interviews.",
  keywords: ["Resume", "CV", "ATS", "Artificial Intelligence", "Career", "Job Search", "Analyzer", "Job Match"],
  authors: [{ name: "AI Resume Analyzer" }],
  creator: "AI Resume Analyzer",
  publisher: "AI Resume Analyzer",
  openGraph: {
    title: "AI Resume Analyzer | Maximize Your Job Matches",
    description: "Analyze your resume against job descriptions to discover missing keywords, improve ATS scores, and get hired faster.",
    url: "https://ai-resume-analyzer.vercel.app",
    siteName: "AI Resume Analyzer",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Analyzer",
    description: "Get actionable AI-driven insights to improve your resume, bypass ATS filters, and land more interviews.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isClerkConfigured = 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.CLERK_SECRET_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_xxxxxxxxxxxxxxxxx';

  if (!isClerkConfigured) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <div className="max-w-md rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-destructive mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h2 className="text-lg font-bold">Authentication Not Configured</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Clerk authentication keys are missing or invalid. Please add your actual <code className="bg-muted text-foreground px-1 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="bg-muted text-foreground px-1 py-0.5 rounded text-xs font-mono">CLERK_SECRET_KEY</code> to your <code className="bg-muted text-foreground px-1 py-0.5 rounded text-xs font-mono">.env.local</code> file to continue.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
