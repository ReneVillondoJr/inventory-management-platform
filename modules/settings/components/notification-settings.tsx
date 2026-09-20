'use client';

import { useState } from 'react';
import { Bell, Check, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { notificationSettingsSchema } from '../schemas/settings-schema';
import type { Settings } from '../types/settings';

type NotificationSettingsProps = {
  settings: Settings['notifications'];
  onSave: (values: Settings['notifications']) => void;
  isSaving: boolean;
  saved: boolean;
};

type SettingToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <label className='flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30'>
      <span className='min-w-0'>
        <span className='block text-sm font-medium'>{title}</span>

        <span className='mt-1 block text-xs leading-5 text-muted-foreground'>
          {description}
        </span>
      </span>

      <input
        type='checkbox'
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className='mt-0.5 size-4 shrink-0 accent-foreground'
      />
    </label>
  );
}

export function NotificationSettings({
  settings,
  onSave,
  isSaving,
  saved,
}: NotificationSettingsProps) {
  const [values, setValues] = useState(settings);

  const update = (key: keyof typeof values, value: boolean) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const result = notificationSettingsSchema.safeParse(values);

    if (!result.success) {
      return;
    }

    onSave(result.data);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold tracking-tight'>
          Notification settings
        </h2>

        <p className='mt-1 text-sm text-muted-foreground'>
          Choose which operational events should generate notifications.
        </p>
      </div>

      <Card className='border-border/60 shadow-none'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <Bell className='size-4 text-muted-foreground' />
            Notification preferences
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-3'>
          <SettingToggle
            title='Email notifications'
            description='Receive important application notifications by email.'
            checked={values.emailNotifications}
            onChange={(value) => update('emailNotifications', value)}
          />

          <SettingToggle
            title='Order notifications'
            description='Get notified when purchase or sales orders are created or updated.'
            checked={values.orderNotifications}
            onChange={(value) => update('orderNotifications', value)}
          />

          <SettingToggle
            title='Inventory alerts'
            description='Receive alerts when inventory activity requires attention.'
            checked={values.inventoryAlerts}
            onChange={(value) => update('inventoryAlerts', value)}
          />

          <SettingToggle
            title='Low-stock alerts'
            description='Notify you when products reach their configured stock threshold.'
            checked={values.lowStockAlerts}
            onChange={(value) => update('lowStockAlerts', value)}
          />

          <SettingToggle
            title='System updates'
            description='Receive information about system maintenance and updates.'
            checked={values.systemUpdates}
            onChange={(value) => update('systemUpdates', value)}
          />

          <SettingToggle
            title='Weekly reports'
            description='Receive a weekly summary of inventory and operational activity.'
            checked={values.weeklyReports}
            onChange={(value) => update('weeklyReports', value)}
          />
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
