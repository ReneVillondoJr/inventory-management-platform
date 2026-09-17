'use client';

import Image from 'next/image';
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

type ProductImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProductImageUpload({
  value,
  onChange,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const processFile = (file?: File) => {
    if (!file) {
      return;
    }

    setError('');

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') {
        onChange(result);
      }
    };

    reader.onerror = () => {
      setError('Unable to read this image. Please try another file.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0]);

    // Allow selecting the same file again.
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    processFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    setError('');
    onChange('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-3'>
      <input
        ref={inputRef}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        onChange={handleFileChange}
        className='hidden'
      />

      {value ?
        <div className='space-y-3'>
          <div className='group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted/20'>
            <Image
              src={value}
              alt='Product preview'
              fill
              unoptimized
              className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
              sizes='(max-width: 640px) 100vw, 320px'
            />

            <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/70 via-black/30 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
              <p className='truncate text-xs font-medium text-white'>
                Product image
              </p>

              <Button
                type='button'
                size='sm'
                variant='secondary'
                onClick={openFilePicker}
              >
                <RefreshCw className='size-3.5' />
                Replace
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-sm font-medium'>Product image</p>
              <p className='text-xs text-muted-foreground'>
                JPG, PNG or WEBP · Maximum 2 MB
              </p>
            </div>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleRemove}
              className='shrink-0 text-destructive hover:text-destructive'
            >
              <Trash2 className='size-4' />
              Remove
            </Button>
          </div>
        </div>
      : <div
          role='button'
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            'flex aspect-4/3 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition-all',
            isDragging ?
              'border-primary bg-primary/5 ring-2 ring-primary/10'
            : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40',
          ].join(' ')}
        >
          <div
            className={[
              'flex size-12 items-center justify-center rounded-xl transition-colors',
              isDragging ?
                'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
            ].join(' ')}
          >
            {isDragging ?
              <UploadCloud className='size-5' />
            : <ImagePlus className='size-5' />}
          </div>

          <p className='mt-4 text-sm font-medium'>
            {isDragging ? 'Drop your image here' : 'Upload product image'}
          </p>

          <p className='mt-1 text-xs text-muted-foreground'>
            Drag and drop or click to browse
          </p>

          <p className='mt-3 text-[11px] text-muted-foreground'>
            JPG, PNG or WEBP · Maximum 2 MB
          </p>
        </div>
      }

      {error && (
        <p role='alert' className='text-xs font-medium text-destructive'>
          {error}
        </p>
      )}
    </div>
  );
}
