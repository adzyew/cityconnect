export default function PublicHomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-3xl rounded-3xl border bg-white p-10 shadow-sm">
        <p className="font-medium text-green-700">Caloocan City</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Welcome to CityConnect
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          A centralized platform for citizen service requests, communication,
          updates, and case tracking.
        </p>
      </section>
    </main>
  )
}