import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <UserProfile routing="hash" />
    </div>
  );
}
