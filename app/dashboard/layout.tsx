import { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/20 flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/10">
            © {new Date().getFullYear()} Dinesh Babu. All Rights Reserved.
          </footer>
        </main>
      </div>
    </div>
  )
}
