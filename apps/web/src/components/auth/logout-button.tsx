export function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
    >
      Log out
    </a>
  );
}