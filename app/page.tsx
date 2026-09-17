import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-slate-50'>
      <div className='w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm'>
        <div className='flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-xl'>
            <p className='mb-3 text-sm font-medium uppercase tracking-[0.24em] text-emerald-400'>
              Inventory Platform
            </p>
            <h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>
              Control stock, orders, and warehouse operations from one place.
            </h1>
          </div>

          <Link
            href='/login'
            className='inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400'
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}
