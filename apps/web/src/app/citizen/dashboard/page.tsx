import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function CitizenDashboardPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/citizen/dashboard");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Citizen Dashboard</h1>

      <p className="mt-2 text-muted-foreground">
        Welcome, {session.user.name ?? session.user.email}.
      </p>
    </main>
  );
}