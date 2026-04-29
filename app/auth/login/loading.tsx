export default function LoginLoading() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-2/3 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
          <div className="h-10 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </section>
  )
}
