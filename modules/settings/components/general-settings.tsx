'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Settings, ThemePreference } from '../types/settings';
import { generalSettingsSchema } from '../schemas/settings-schema';

type GeneralSettingsProps = {
  settings: Settings['general'];
  onSave: (values: Settings['general']) => void;
  isSaving: boolean;
  saved: boolean;
};

export function GeneralSettings({
  settings,
  onSave,
  isSaving,
  saved,
}: GeneralSettingsProps) {
  const [values, setValues] = useState(settings);
  const [error, setError] = useState('');

  const update = <K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setError('');
  };

  const handleSave = () => {
    const result = generalSettingsSchema.safeParse(values);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid settings.');
      return;
    }

    onSave(result.data);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold tracking-tight'>
          General settings
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Configure the main preferences used across your inventory workspace.
        </p>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-sm'>Application</CardTitle>
        </CardHeader>

        <CardContent className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='company-name'>Company name</Label>

            <Input
              id='company-name'
              value={values.companyName}
              onChange={(event) => update('companyName', event.target.value)}
              placeholder='Your company name'
            />
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='currency'>Currency</Label>

              <select
                id='currency'
                value={values.currency}
                onChange={(event) => update('currency', event.target.value)}
                className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm'
              >
                <option value='PHP'>PHP — Philippine Peso</option>

                <option value='USD'>USD — US Dollar</option>

                <option value='EUR'>EUR — Euro</option>

                <option value='GBP'>GBP — British Pound</option>
              </select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='timezone'>Timezone</Label>

              <select
                id='timezone'
                value={values.timezone}
                onChange={(event) => update('timezone', event.target.value)}
                className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm'
              >
                <option value='Asia/Manila'>Asia/Manila</option>

                <option value='Asia/Singapore'>Asia/Singapore</option>

                <option value='Asia/Tokyo'>Asia/Tokyo</option>

                <option value='UTC'>UTC</option>

                <option value='America/New_York'>America/New_York</option>

                <option value='America/Los_Angeles'>America/Los_Angeles</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-sm'>Regional format</CardTitle>
        </CardHeader>

        <CardContent className='grid gap-5 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='date-format'>Date format</Label>

            <select
              id='date-format'
              value={values.dateFormat}
              onChange={(event) =>
                update(
                  'dateFormat',
                  event.target.value as Settings['general']['dateFormat'],
                )
              }
              className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm'
            >
              <option value='MM/DD/YYYY'>MM/DD/YYYY</option>

              <option value='DD/MM/YYYY'>DD/MM/YYYY</option>

              <option value='YYYY-MM-DD'>YYYY-MM-DD</option>
            </select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='time-format'>Time format</Label>

            <select
              id='time-format'
              value={values.timeFormat}
              onChange={(event) =>
                update(
                  'timeFormat',
                  event.target.value as Settings['general']['timeFormat'],
                )
              }
              className='h-9 w-full rounded-md border border-input bg-background px-3 text-sm'
            >
              <option value='12-hour'>12-hour</option>

              <option value='24-hour'>24-hour</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {error ?
        <p className='text-sm text-destructive'>{error}</p>
      : null}

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
