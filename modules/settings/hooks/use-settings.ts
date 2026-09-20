'use client';

import { useCallback, useState } from 'react';

import { settingsService } from '../services/settings-service';

import type { Settings, SettingsSection } from '../types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    settingsService.get(),
  );

  const [isSaving, setIsSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const updateSection = useCallback(
    <K extends SettingsSection>(section: K, values: Settings[K]) => {
      setIsSaving(true);
      setSaved(false);

      const updated = settingsService.updateSection(section, values);

      setSettings(updated);

      setIsSaving(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    },
    [],
  );

  const updateSettings = useCallback((values: Partial<Settings>) => {
    setIsSaving(true);
    setSaved(false);

    const current = settingsService.get();

    const updated: Settings = {
      general: {
        ...current.general,
        ...values.general,
      },

      profile: {
        ...current.profile,
        ...values.profile,
      },

      notifications: {
        ...current.notifications,
        ...values.notifications,
      },

      security: {
        ...current.security,
        ...values.security,
      },

      system: {
        ...current.system,
        ...values.system,
      },
    };

    settingsService.save(updated);

    setSettings(updated);

    setIsSaving(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }, []);

  const resetSettings = useCallback(() => {
    setIsSaving(true);

    const defaults = settingsService.reset();

    setSettings(defaults);

    setIsSaving(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
  }, []);

  return {
    settings,
    isSaving,
    saved,
    updateSection,
    updateSettings,
    resetSettings,
  };
}
