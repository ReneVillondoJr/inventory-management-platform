import { rolePermissions, type RoleName } from '@/lib/auth/permissions';

import { seedData } from './inventory-seed';

/**
 * Temporary client-side credentials for exercising the seeded roles.
 * Replace this module with a server-side authentication provider before release.
 */
export const TEMPORARY_TEST_PASSWORD = 'inventory123';
export const TEMPORARY_TEST_EMAIL = ' alex@northstarsupply.example';

export type TestUser = {
  id: string;
  name: string;
  email: string;
  role: RoleName;
};

export function authenticateTestUser(
  email: string,
  password: string,
): TestUser | null {
  if (password !== TEMPORARY_TEST_PASSWORD) {
    return null;
  }

  const user = seedData.users.find(
    (candidate) =>
      candidate.status === 'ACTIVE' &&
      candidate.email.toLowerCase() === email.trim().toLowerCase(),
  );

  if (!user) {
    return null;
  }

  const role = seedData.roles.find((candidate) => candidate.id === user.roleId);

  if (!role || !(role.name in rolePermissions)) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: role.name as RoleName,
  };
}
