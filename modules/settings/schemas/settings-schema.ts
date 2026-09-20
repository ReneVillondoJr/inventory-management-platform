import { z } from 'zod';

export const generalSettingsSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must contain at least 2 characters.')
    .max(100, 'Company name must be less than 100 characters.'),

  currency: z.string().min(1, 'Currency is required.'),

  timezone: z.string().min(1, 'Timezone is required.'),

  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),

  timeFormat: z.enum(['12-hour', '24-hour']),

  theme: z.enum(['light', 'dark', 'system']),
});

export const profileSettingsSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must contain at least 2 characters.'),

  lastName: z.string().min(2, 'Last name must contain at least 2 characters.'),

  email: z.string().email('Enter a valid email address.'),

  phone: z.string().max(30, 'Phone number is too long.'),

  jobTitle: z.string().max(100, 'Job title is too long.'),

  department: z.string().max(100, 'Department is too long.'),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  orderNotifications: z.boolean(),
  inventoryAlerts: z.boolean(),
  lowStockAlerts: z.boolean(),
  systemUpdates: z.boolean(),
  weeklyReports: z.boolean(),
});

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean(),
  loginAlerts: z.boolean(),

  sessionTimeout: z.number().int().min(5).max(480),
});

export const systemSettingsSchema = z.object({
  autoRefresh: z.boolean(),

  refreshInterval: z.number().int().min(10).max(300),

  compactMode: z.boolean(),

  showArchivedRecords: z.boolean(),
});

export const settingsSchema = z.object({
  general: generalSettingsSchema,
  profile: profileSettingsSchema,
  notifications: notificationSettingsSchema,
  security: securitySettingsSchema,
  system: systemSettingsSchema,
});
