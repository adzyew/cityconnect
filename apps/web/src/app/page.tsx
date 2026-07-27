import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { auth0 } from "@/lib/auth0";

export default async function HomePage() {
  const session = await auth0.getSession();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="space-y-6 text-center">
        <div>
          <h1 className="text-4xl font-bold">CityConnect</h1>
          <p className="mt-2 text-muted-foreground">
            Citizen services and local government management platform
          </p>
        </div>

        {session ? (
          <div className="space-y-4">
            <p>
              Logged in as{" "}
              <strong>{session.user.name ?? session.user.email}</strong>
            </p>

            <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </section>
    </main>
  );
}