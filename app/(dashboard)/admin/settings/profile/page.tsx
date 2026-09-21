'use client';

import { ProfileSettings } from '@/modules/settings/components/profile-settings';
import { SettingsPage } from '@/modules/settings';
import { useSettings } from '@/modules/settings/hooks/use-settings';

export default function ProfileSettingsPage() {
  const { settings, isSaving, saved, updateSection } = useSettings();

  return (
    <SettingsPage>
      <ProfileSettings
        settings={settings.profile}
        onSave={(values) => updateSection('profile', values)}
        isSaving={isSaving}
        saved={saved}
      />
    </SettingsPage>
  );
}
