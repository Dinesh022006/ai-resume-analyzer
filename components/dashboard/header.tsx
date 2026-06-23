"use client"

import { Menu } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b glass px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2 rounded-full hover:bg-muted/80">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h2 className="text-lg font-bold tracking-tight md:hidden text-gradient">AI Resume</h2>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-3 pl-4 border-l">
          {!isLoaded ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex gap-1">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            </div>
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium leading-none">
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {user.fullName ? user.primaryEmailAddress?.emailAddress : "Pro Plan"}
                </span>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
