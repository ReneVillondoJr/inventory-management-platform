import { Barcode } from './barcode';

export function LoginBrand() {
  return (
    <div>
      <Barcode />

      <h1 className='mt-5 font-mono-ui text-[26px] font-medium tracking-tight text-[#eef0ee]'>
        Sign in
      </h1>

      <p className='font-sans-ui mt-1.5 text-[13px] text-[#868c91]'>
        Authenticate to access inventory control.
      </p>
    </div>
  );
}
