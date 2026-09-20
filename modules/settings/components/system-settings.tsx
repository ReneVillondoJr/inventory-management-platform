'use client';

import { useState } from 'react';
import { Check, MonitorCog, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { systemSettingsSchema } from '../schemas/settings-schema';
import type { Settings } from '../types/settings';

type SystemSettingsProps = {
  settings: Settings['system'];
  onSave: (values: Settings['system']) => void;
  isSaving: boolean;
  saved: boolean;
};

export function SystemSettings({
  settings,
  onSave,
  isSaving,
  saved,
}: SystemSettingsProps) {
  const [values, setValues] = useState(settings);

  const update = (key: keyof typeof values, value: boolean | number) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const result = systemSettingsSchema.safeParse(values);

    if (!result.success) {
      return;
    }

    onSave(result.data);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold tracking-tight'>
          System settings
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Control workspace behavior and data presentation.
        </p>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <MonitorCog className='size-4 text-muted-foreground' />
            Workspace behavior
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-3'>
          <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4'>
            <span>
              <span className='block text-sm font-medium'>
                Automatic refresh
              </span>

              <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
                Automatically refresh operational data while the workspace is
                open.
              </span>
            </span>

            <input
              type='checkbox'
              checked={values.autoRefresh}
              onChange={(event) => update('autoRefresh', event.target.checked)}
              className='mt-0.5 size-4 accent-foreground'
            />
          </label>

          <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4'>
            <span>
              <span className='block text-sm font-medium'>Compact mode</span>

              <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
                Reduce spacing in tables and operational interfaces.
              </span>
            </span>

            <input
              type='checkbox'
              checked={values.compactMode}
              onChange={(event) => update('compactMode', event.target.checked)}
              className='mt-0.5 size-4 accent-foreground'
            />
          </label>

          <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4'>
            <span>
              <span className='block text-sm font-medium'>
                Show archived records
              </span>

              <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
                Include archived records when browsing operational data.
              </span>
            </span>

            <input
              type='checkbox'
              checked={values.showArchivedRecords}
              onChange={(event) =>
                update('showArchivedRecords', event.target.checked)
              }
              className='mt-0.5 size-4 accent-foreground'
            />
          </label>
        </CardContent>
      </Card>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='text-sm'>Refresh interval</CardTitle>
        </CardHeader>

        <CardContent className='space-y-2'>
          <Label htmlFor='refresh-interval'>Automatic refresh interval</Label>

          <div className='flex items-center gap-2'>
            <Input
              id='refresh-interval'
              type='number'
              min={10}
              max={300}
              value={values.refreshInterval}
              onChange={(event) =>
                update('refreshInterval', Number(event.target.value))
              }
              className='max-w-[180px]'
            />

            <span className='text-sm text-muted-foreground'>seconds</span>
          </div>

          <p className='text-xs text-muted-foreground'>
            Applies when automatic refresh is enabled.
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
