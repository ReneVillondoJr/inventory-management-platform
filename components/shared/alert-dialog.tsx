'use client';

import type { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/shared/button';
import { cn } from '@/lib/utils';

type AlertDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  title: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  destructive?: boolean;
};

export function AlertDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  loading = false,
  destructive = false,
}: AlertDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange?.(false);
    } catch {}
  };

  return (
    <BaseAlertDialog
      open={open}
      onOpenChange={(next) => {
        if (loading && !next) return;
        onOpenChange?.(next);
      }}
    >
      {trigger ?
        <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      : null}

      <AlertDialogContent className='max-w-md p-4 shadow-xl'>
        <AlertDialogHeader className='items-center text-center'>
          <AlertDialogMedia
            className={cn(
              'mb-2 flex size-11 items-center justify-center rounded-full',
              destructive ?
                'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary',
            )}
          >
            <span className='text-lg font-semibold'>
              {destructive ? '!' : 'i'}
            </span>
          </AlertDialogMedia>

          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description ?
            <AlertDialogDescription className='text-balance'>
              {description}
            </AlertDialogDescription>
          : null}
        </AlertDialogHeader>

        <AlertDialogFooter className='mt-4 flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/40 p-4 sm:flex-row sm:justify-end'>
          <AlertDialogCancel
            type='button'
            onClick={() => onOpenChange?.(false)}
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>

          <Button
            type='button'
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ?
              <>
                <Loader2 className='size-4 animate-spin' />
                Please wait...
              </>
            : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog>
  );
}

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
