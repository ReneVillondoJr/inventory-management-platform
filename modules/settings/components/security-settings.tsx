'use client';

import { useState } from 'react';
import { Check, KeyRound, Save, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { securitySettingsSchema } from '../schemas/settings-schema';
import type { Settings } from '../types/settings';

type SecuritySettingsProps = {
  settings: Settings['security'];
  onSave: (values: Settings['security']) => void;
  isSaving: boolean;
  saved: boolean;
};

export function SecuritySettings({
  settings,
  onSave,
  isSaving,
  saved,
}: SecuritySettingsProps) {
  const [values, setValues] = useState(settings);

  const update = (key: keyof typeof values, value: boolean | number) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const result = securitySettingsSchema.safeParse(values);

    if (!result.success) {
      return;
    }

    onSave(result.data);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold tracking-tight'>
          Security settings
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Configure account protection and session behavior.
        </p>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <ShieldCheck className='size-4 text-muted-foreground' />
            Account security
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-3'>
          <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4'>
            <span>
              <span className='block text-sm font-medium'>
                Two-factor authentication
              </span>

              <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
                Require an additional verification step when signing in.
              </span>
            </span>

            <input
              type='checkbox'
              checked={values.twoFactorEnabled}
              onChange={(event) =>
                update('twoFactorEnabled', event.target.checked)
              }
              className='mt-0.5 size-4 accent-foreground'
            />
          </label>

          <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4'>
            <span>
              <span className='block text-sm font-medium'>Login alerts</span>

              <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
                Notify you when your account is accessed from a new session.
              </span>
            </span>

            <input
              type='checkbox'
              checked={values.loginAlerts}
              onChange={(event) => update('loginAlerts', event.target.checked)}
              className='mt-0.5 size-4 accent-foreground'
            />
          </label>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <KeyRound className='size-4 text-muted-foreground' />
            Session
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-2'>
          <Label htmlFor='session-timeout'>Session timeout</Label>

          <div className='flex items-center gap-2'>
            <Input
              id='session-timeout'
              type='number'
              min={5}
              max={480}
              value={values.sessionTimeout}
              onChange={(event) =>
                update('sessionTimeout', Number(event.target.value))
              }
              className='max-w-[180px]'
            />

            <span className='text-sm text-muted-foreground'>minutes</span>
          </div>

          <p className='text-xs text-muted-foreground'>
            Automatically expire inactive sessions after the configured period.
          </p>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button type='button' onClick={handleSave} disabled={isSaving}>
          {saved ?
            <Check className='size-4' />
          : <Save className='size-4' />}

          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}
