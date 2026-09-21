'use client';

import { SecuritySettings } from '@/modules/settings/components/security-settings';
import { SettingsPage } from '@/modules/settings';
import { useSettings } from '@/modules/settings/hooks/use-settings';

export default function SecuritySettingsPage() {
  const { settings, isSaving, saved, updateSection } = useSettings();

  return (
    <SettingsPage>
      <SecuritySettings
        settings={settings.security}
        onSave={(values) => updateSection('security', values)}
        isSaving={isSaving}
        saved={saved}
      />
    </SettingsPage>
  );
}
