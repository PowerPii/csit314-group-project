import Link from "next/link";
import { SearchRoleController } from "@/control/SearchRoleController";
import { ViewRolesController } from "@/control/ViewRolesController";
import { requireRole } from "@/lib/session";
import { ActionButton } from "../../ActionButton";
import { ActorHeader } from "../../ActorHeader";
import { SearchBox } from "../../SearchBox";
import { ui } from "../../ui";
import { USER_ADMIN_NAV } from "../nav";
import { suspendRoleAction } from "./actions";

// ViewRolesBoundary (UA #11). With ?name=... it is SearchRoleBoundary (UA #14).
export default async function ViewRolesBoundary({ searchParams }: PageProps<"/user-admin/roles">) {
  const session = await requireRole("User Admin");
  const { name } = await searchParams;
  const query = typeof name === "string" ? name.trim() : "";

  const roles = query
    ? await new SearchRoleController().searchRoles(query)
    : await new ViewRolesController().viewRoles();

  return (
    <>
      <ActorHeader title="Roles" name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6 sm:p-10">
        <SearchBox name="name" value={query} placeholder="Search by role name" clearHref="/user-admin/roles" />
        {roles.length === 0 ? (
          <p>No roles match.</p>
        ) : (
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Name</th>
                <th className={ui.th}>Description</th>
                <th className={ui.th}>Status</th>
                <th className={ui.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td className={ui.td}>{r.name}</td>
                  <td className={ui.td}>{r.description}</td>
                  <td className={ui.td}><span className={r.isSuspended ? ui.mutedPill : ui.pill}>{r.isSuspended ? "Suspended" : "Active"}</span></td>
                  <td className={ui.td}>
                    <div className="flex flex-wrap items-start gap-2">
                    <Link href={`/user-admin/roles/${r.id}/edit`} className={ui.smallButton}>Edit</Link>
                    {!r.isSuspended && r.name !== "User Admin" && (
                      <ActionButton
                        action={suspendRoleAction.bind(null, r.id)}
                        label="Suspend"
                        confirmText={`Suspend the ${r.name} role? Every ${r.name} account will be blocked from logging in.`}
                        className={ui.smallButton}
                      />
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
