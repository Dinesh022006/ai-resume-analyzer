import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your profile details and security preferences.</p>
      </div>

      <div className="grid gap-8">
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl pb-6">
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal information used for analysis reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="font-semibold text-foreground/90">Full Name</Label>
              <Input id="name" defaultValue="John Doe" className="rounded-xl h-11 bg-background" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="font-semibold text-foreground/90">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" className="rounded-xl h-11 bg-background" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-5 flex justify-end">
            <Button className="rounded-full px-8 shadow-sm hover:shadow-md transition-all">Save Changes</Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl pb-6">
            <CardTitle>Security</CardTitle>
            <CardDescription>Ensure your account is using a strong password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-3">
              <Label htmlFor="current-password" className="font-semibold text-foreground/90">Current Password</Label>
              <Input id="current-password" type="password" className="rounded-xl h-11 bg-background" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="new-password" className="font-semibold text-foreground/90">New Password</Label>
              <Input id="new-password" type="password" className="rounded-xl h-11 bg-background" />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-5 flex justify-end">
            <Button variant="secondary" className="rounded-full px-8 hover:bg-muted-foreground/10 transition-colors border shadow-sm">Update Password</Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow-sm border-destructive/20 bg-destructive/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-destructive">
            <AlertTriangle className="h-32 w-32 -mt-12 -mr-12" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription className="text-destructive/80">Permanently delete your account and all associated resumes.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 shadow-sm">
              <p className="text-sm font-medium text-destructive">
                Warning: Once you delete your account, there is no going back. All your uploaded resumes, history, and analysis reports will be permanently wiped from our servers.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-destructive/10 px-6 py-5 flex justify-end relative z-10">
            <Button variant="destructive" className="rounded-full px-8 shadow-sm transition-all hover:shadow-md hover:bg-destructive/90">Delete Account</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
