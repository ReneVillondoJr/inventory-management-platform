'use client';

import { useState } from 'react';
import { Check, Save, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { profileSettingsSchema } from '../schemas/settings-schema';
import type { Settings } from '../types/settings';

type ProfileSettingsProps = {
  settings: Settings['profile'];
  onSave: (values: Settings['profile']) => void;
  isSaving: boolean;
  saved: boolean;
};

export function ProfileSettings({
  settings,
  onSave,
  isSaving,
  saved,
}: ProfileSettingsProps) {
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
    const result = profileSettingsSchema.safeParse(values);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Invalid profile.');
      return;
    }

    onSave(result.data);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold tracking-tight'>
          Profile settings
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Manage the personal information associated with your administrator
          account.
        </p>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <UserRound className='size-4 text-muted-foreground' />
            Personal information
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-5'>
          <div className='grid gap-5 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='first-name'>First name</Label>

              <Input
                id='first-name'
                value={values.firstName}
                onChange={(event) => update('firstName', event.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='last-name'>Last name</Label>

              <Input
                id='last-name'
                value={values.lastName}
                onChange={(event) => update('lastName', event.target.value)}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='profile-email'>Email address</Label>

            <Input
              id='profile-email'
              type='email'
              value={values.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone number</Label>

              <Input
                id='phone'
                value={values.phone}
                onChange={(event) => update('phone', event.target.value)}
                placeholder='+63 900 000 0000'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='job-title'>Job title</Label>

              <Input
                id='job-title'
                value={values.jobTitle}
                onChange={(event) => update('jobTitle', event.target.value)}
                placeholder='Administrator'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='department'>Department</Label>

            <Input
              id='department'
              value={values.department}
              onChange={(event) => update('department', event.target.value)}
              placeholder='Operations'
            />
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
