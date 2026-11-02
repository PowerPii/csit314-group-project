// Builders for entity objects used in controller unit tests (no database).
import { Role } from "@/entity/Role";
import { UserAccount } from "@/entity/UserAccount";

export function makeAccount(
  overrides: Partial<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    roleId: number;
    roleName: string;
    isSuspended: boolean;
    isRoleSuspended: boolean;
  }> = {},
): UserAccount {
  return new UserAccount(
    overrides.id ?? 7,
    overrides.name ?? "Alex",
    overrides.email ?? "alex@example.com",
    overrides.phone ?? null,
    overrides.roleId ?? 3,
    overrides.roleName ?? "Customer",
    overrides.isSuspended ?? false,
    overrides.isRoleSuspended ?? false,
    new Date("2026-10-01T00:00:00Z"),
    "hash",
  );
}

export function makeRole(
  overrides: Partial<{ id: number; name: string; description: string; isSuspended: boolean }> = {},
): Role {
  return new Role(
    overrides.id ?? 5,
    overrides.name ?? "Moderator",
    overrides.description ?? "Reviews projects",
    overrides.isSuspended ?? false,
  );
}
