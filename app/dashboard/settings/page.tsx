"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ExternalLink } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUserAccount } from "@/lib/actions";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFullName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
    }
  }, [isLoaded, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const parts = fullName.split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      await user.update({ firstName, lastName });
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      setIsDeleting(true);
      await deleteUserAccount();
      toast.success("Account deleted successfully");
      await signOut();
      router.push("/");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  if (!isLoaded) {
    return <div className="max-w-3xl space-y-8 p-8 animate-pulse bg-muted/20 rounded-2xl h-[500px]" />;
  }

  const emailAddress = user?.primaryEmailAddress?.emailAddress || "";

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
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-11 bg-background" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="font-semibold text-foreground/90">Email Address</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input id="email" type="email" value={emailAddress} disabled className="rounded-xl h-11 bg-background flex-1" />
                <Button variant="outline" onClick={() => router.push("/dashboard/profile")} className="h-11 rounded-xl whitespace-nowrap">
                  Manage Email <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-5 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="rounded-full px-8 shadow-sm hover:shadow-md transition-all">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader className="bg-muted/30 border-b border-border/50 rounded-t-2xl pb-6">
            <CardTitle>Security</CardTitle>
            <CardDescription>Ensure your account is using a strong password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              For your security, password and multi-factor authentication changes are managed securely through your account provider.
            </p>
          </CardContent>
          <CardFooter className="border-t border-border/50 bg-muted/10 px-6 py-5 flex justify-end">
            <Button onClick={() => router.push("/dashboard/profile")} variant="secondary" className="rounded-full px-8 hover:bg-muted-foreground/10 transition-colors border shadow-sm">
              Manage Security <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
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
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button variant="destructive" className="rounded-full px-8 shadow-sm transition-all hover:shadow-md hover:bg-destructive/90">Delete Account</Button>
              } />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account, remove your data from our servers, and erase all your resumes and analysis history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-4">
                  <Label htmlFor="confirm-delete" className="mb-2 block font-medium">
                    Please type <strong className="text-foreground font-bold">DELETE</strong> to confirm.
                  </Label>
                  <Input 
                    id="confirm-delete" 
                    value={deleteConfirm} 
                    onChange={(e) => setDeleteConfirm(e.target.value)} 
                    placeholder="DELETE" 
                    className="border-destructive/50 focus-visible:ring-destructive"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount} 
                    disabled={deleteConfirm !== "DELETE" || isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
