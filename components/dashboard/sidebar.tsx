"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { LayoutDashboard, Upload, History, Settings, FileText, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Resume", href: "/dashboard/upload", icon: Upload },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card px-4 py-6 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      <div className="mb-10 flex items-center px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
          <FileText className="h-5 w-5" />
        </div>
        <span className="ml-3 text-xl font-bold tracking-tight text-gradient">AI Resume</span>
      </div>
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto pt-6 space-y-4">
        {isLoaded && isSignedIn && (
          <div className="px-2 pb-2 border-b border-border/50">
            <p className="text-sm font-semibold truncate text-foreground">{user.fullName || user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/10">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="h-16 w-16" />
          </div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            Pro Plan <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">Active</span>
          </h4>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            You have unlimited access to AI analysis and ATS scoring.
          </p>
          <Link href="/dashboard/settings" className="mt-4 inline-flex text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide">
            Manage Plan &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
