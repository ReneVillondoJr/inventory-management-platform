import {
  defaultSettings,
  type Settings,
  type SettingsSection,
} from '../types/settings';

const STORAGE_KEY = 'inventory-management-settings';

function isBrowser() {
  return typeof window !== 'undefined';
}

function cloneDefaults(): Settings {
  return structuredClone(defaultSettings);
}

function mergeSettings(
  current: Settings,
  incoming: Partial<Settings>,
): Settings {
  return {
    general: {
      ...current.general,
      ...incoming.general,
    },

    profile: {
      ...current.profile,
      ...incoming.profile,
    },

    notifications: {
      ...current.notifications,
      ...incoming.notifications,
    },

    security: {
      ...current.security,
      ...incoming.security,
    },

    system: {
      ...current.system,
      ...incoming.system,
    },
  };
}

export const settingsService = {
  get(): Settings {
    if (!isBrowser()) {
      return cloneDefaults();
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return cloneDefaults();
      }

      const parsed = JSON.parse(stored) as Partial<Settings>;

      return mergeSettings(cloneDefaults(), parsed);
    } catch {
      return cloneDefaults();
    }
  },

  save(settings: Settings): Settings {
    if (!isBrowser()) {
      return settings;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    return settings;
  },

  updateSection<K extends SettingsSection>(
    section: K,
    values: Settings[K],
  ): Settings {
    const current = this.get();

    const updated = {
      ...current,
      [section]: values,
    } as Settings;

    return this.save(updated);
  },

  reset(): Settings {
    const defaults = cloneDefaults();

    return this.save(defaults);
  },

  clear(): void {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  },
};
