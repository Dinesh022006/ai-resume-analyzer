import { SignIn } from "@clerk/nextjs";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background py-12">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none -translate-x-1/3 translate-y-1/4" />

      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tight group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm group-hover:shadow-md transition-all">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-gradient">AI Resume</span>
        </Link>
      </div>

      <div className="w-full max-w-md px-4 z-10 animate-in fade-in zoom-in-95 duration-500 flex justify-center">
        <SignIn
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-2xl border-border/50 rounded-3xl overflow-hidden glass bg-background/80",
              headerTitle: "text-2xl font-extrabold tracking-tight text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border/60 hover:bg-muted/50 transition-colors",
              dividerLine: "bg-border/60",
              dividerText: "text-muted-foreground",
              formFieldLabel: "font-semibold text-foreground/90",
              formFieldInput: "rounded-xl h-11 bg-background/50 focus:bg-background transition-colors border-border/60",
              formButtonPrimary: "rounded-xl h-11 shadow-md hover:shadow-lg transition-all text-base",
              footerActionText: "text-muted-foreground",
              footerActionLink: "font-bold text-primary hover:text-primary/80 transition-colors"
            }
          }}
        />
      </div>
    </div>
  );
}
