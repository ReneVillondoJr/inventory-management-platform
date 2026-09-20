import { seedData } from '@/data/seed/inventory-seed';

export type SettingsSection =
  | 'general'
  | 'profile'
  | 'notifications'
  | 'security'
  | 'system';

export type ThemePreference = 'light' | 'dark' | 'system';

export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

export type TimeFormat = '12-hour' | '24-hour';

export type Settings = {
  general: {
    companyName: string;
    currency: string;
    timezone: string;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    theme: ThemePreference;
  };

  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department: string;
  };

  notifications: {
    emailNotifications: boolean;
    orderNotifications: boolean;
    inventoryAlerts: boolean;
    lowStockAlerts: boolean;
    systemUpdates: boolean;
    weeklyReports: boolean;
  };

  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };

  system: {
    autoRefresh: boolean;
    refreshInterval: number;
    compactMode: boolean;
    showArchivedRecords: boolean;
  };
};

export type SettingsUpdate = Partial<Settings>;

export const defaultSettings: Settings = {
  general: {
    companyName: seedData.company.name,
    currency: seedData.company.currency,
    timezone: seedData.company.timezone,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    theme: 'system',
  },

  profile: {
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex@northstarsupply.example',
    phone: '',
    jobTitle: 'Administrator',
    department: 'Operations',
  },

  notifications: {
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    lowStockAlerts: true,
    systemUpdates: true,
    weeklyReports: false,
  },

  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
  },

  system: {
    autoRefresh: true,
    refreshInterval: 30,
    compactMode: false,
    showArchivedRecords: false,
  },
};

export const settingsSections: Array<{
  id: SettingsSection;
  label: string;
  description: string;
}> = [
  {
    id: 'general',
    label: 'General',
    description: 'Application preferences',
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Personal information',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Alerts and updates',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Account protection',
  },
  {
    id: 'system',
    label: 'System',
    description: 'System preferences',
  },
];
