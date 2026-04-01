export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-50">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
          Maintenance Mode
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance">
          The portal is temporarily unavailable.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          We&apos;ve paused access while maintenance is in progress. Your data is
          unchanged and the system can be restored as soon as maintenance mode is
          turned off.
        </p>
        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          Admins can restore service through the internal maintenance endpoint.
        </div>
      </div>
    </main>
  );
}
