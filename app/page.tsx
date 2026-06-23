import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Zap, Shield, Sparkles } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none translate-x-1/3 -translate-y-1/4" />

      {/* Navbar */}
      <header className="px-6 lg:px-12 h-20 flex items-center glass sticky top-0 z-50">
        <Link className="flex items-center justify-center group" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm group-hover:shadow-md transition-all">
            <FileText className="h-5 w-5" />
          </div>
          <span className="ml-3 text-2xl font-extrabold tracking-tight">AI Resume</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6 sm:gap-8">
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" href="#pricing">
            Pricing
          </Link>
          <div className="flex items-center gap-3">
            {userId ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-6 font-medium shadow-sm transition-transform hover:scale-105 active:scale-95">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="font-medium rounded-full px-5 hidden sm:inline-flex">Log in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="rounded-full px-6 font-medium shadow-sm transition-transform hover:scale-105 active:scale-95">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 flex justify-center text-center px-4 relative">
          <div className="container max-w-5xl">
            <div className="flex flex-col items-center space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Next-Gen ATS Scoring Engine Live
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Land Your Dream Job with <br className="hidden md:block" />
                <span className="text-gradient">AI-Powered</span> Insights
              </h1>
              
              <p className="mx-auto max-w-[750px] text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
                Upload your resume and get actionable feedback, exact ATS compatibility scores, and tailored improvement suggestions instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <Link href={userId ? "/dashboard/upload" : "/sign-up"}>
                  <Button size="lg" className="rounded-full h-14 px-10 text-lg shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1">
                    Analyze Your Resume <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="rounded-full h-14 px-10 text-lg border-muted-foreground/20 hover:bg-muted/50 transition-all hover:-translate-y-1">
                    {userId ? "Go to Dashboard" : "View Interactive Demo"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 md:py-32 bg-muted/30 flex justify-center border-t border-border/40 relative">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to stand out</h2>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Our AI analyzes your resume against millions of successful profiles to give you the competitive edge in today&apos;s market.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-6xl items-start gap-8 py-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-start space-y-5 rounded-2xl border bg-card p-8 card-hover relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">Instant Feedback</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get real-time suggestions on grammar, tone, and action verbs to make your bullet points pop instantly.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-start space-y-5 rounded-2xl border bg-card p-8 card-hover relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">ATS Optimization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ensure your resume passes Applicant Tracking Systems with precise keyword matching and strict format checks.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-start space-y-5 rounded-2xl border bg-card p-8 card-hover relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">Privacy First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is yours alone. We use enterprise-grade security and never share your resume with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row gap-6 py-10 w-full items-center px-6 md:px-12 border-t bg-background">
        <div className="flex items-center gap-2 font-bold tracking-tight text-muted-foreground">
          <FileText className="h-5 w-5" /> AI Resume
        </div>
        <p className="text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l sm:border-border">
          © {new Date().getFullYear()} Dinesh Babu. All Rights Reserved.
        </p>
        <nav className="sm:ml-auto flex gap-6">
          <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
