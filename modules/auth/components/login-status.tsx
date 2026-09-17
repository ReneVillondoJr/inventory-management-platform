import Link from 'next/link';

export function LoginStatus() {
  return (
    <div className='flex items-center justify-between border-t border-[#262b2f] bg-[#1c2023] px-5 py-3 sm:px-7'>
      <div className='flex min-w-0 items-center gap-2.5'>
        <span className='relative flex size-1.5 shrink-0'>
          <span className='login-status-ping absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4c9a6a] opacity-70' />
          <span className='relative inline-flex size-1.5 rounded-full bg-[#4c9a6a]' />
        </span>

        <span className='font-mono-ui truncate text-[10px] text-[#868c91]'>
          System operational
        </span>
      </div>

      <Link
        href='/'
        className='font-mono-ui ml-4 shrink-0 text-[10px] text-[#868c91] transition-colors hover:text-[#e2a23c]'
      >
        ← Back to home
      </Link>
    </div>
  );
}
