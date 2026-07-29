import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-lg rounded-3xl border bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
          Access denied
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          You are not authorized
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Your account does not have permission to access this page.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
        >
          Return to homepage
        </Link>
      </section>
    </main>
  )
}