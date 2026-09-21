'use client';

import { NotificationSettings } from '@/modules/settings/components/notification-settings';
import { SettingsPage } from '@/modules/settings';
import { useSettings } from '@/modules/settings/hooks/use-settings';

export default function NotificationsSettingsPage() {
  const { settings, isSaving, saved, updateSection } = useSettings();

  return (
    <SettingsPage>
      <NotificationSettings
        settings={settings.notifications}
        onSave={(values) => updateSection('notifications', values)}
        isSaving={isSaving}
        saved={saved}
      />
    </SettingsPage>
  );
}
