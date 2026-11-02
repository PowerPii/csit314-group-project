import Link from "next/link";
import { SearchUserAccountController } from "@/control/SearchUserAccountController";
import { ViewUserAccountsController } from "@/control/ViewUserAccountsController";
import { requireRole } from "@/lib/session";
import { ActionButton } from "../../ActionButton";
import { ActorHeader } from "../../ActorHeader";
import { SearchBox } from "../../SearchBox";
import { ui } from "../../ui";
import { USER_ADMIN_NAV } from "../nav";
import { deleteUserAccountAction, reactivateUserAccountAction, suspendUserAccountAction } from "./actions";

// ViewUserAccountsBoundary (UA #4). With ?email=... it is SearchUserAccountBoundary (UA #9).
export default async function ViewUserAccountsBoundary({ searchParams }: PageProps<"/user-admin/accounts">) {
  const session = await requireRole("User Admin");
  const { email } = await searchParams;
  const query = typeof email === "string" ? email.trim() : "";

  const accounts = query
    ? await new SearchUserAccountController().searchUserAccounts(query)
    : await new ViewUserAccountsController().viewUserAccounts();

  return (
    <>
      <ActorHeader title="User accounts" name={session.name} nav={USER_ADMIN_NAV} />
      <main className="p-6">
        <SearchBox name="email" value={query} placeholder="Search by email" clearHref="/user-admin/accounts" />
        <p className="mb-2 text-sm">
          {query ? `${accounts.length} account(s) match "${query}".` : `${accounts.length} accounts.`}
        </p>
        {accounts.length === 0 ? (
          <p>No accounts match.</p>
        ) : (
          <table className={ui.table}>
            <thead>
              <tr>
                <th className={ui.th}>Name</th>
                <th className={ui.th}>Email</th>
                <th className={ui.th}>Phone</th>
                <th className={ui.th}>Role</th>
                <th className={ui.th}>Status</th>
                <th className={ui.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td className={ui.td}>{a.name}</td>
                  <td className={ui.td}>{a.email}</td>
                  <td className={ui.td}>{a.phone ?? ""}</td>
                  <td className={ui.td}>{a.roleName}</td>
                  <td className={ui.td}>{a.isSuspended ? "Suspended" : "Active"}</td>
                  <td className={ui.td}>
                    <div className="flex flex-wrap items-start gap-2">
                    <Link href={`/user-admin/accounts/${a.id}/edit`} className={ui.smallButton}>Edit</Link>
                    {a.isSuspended ? (
                      <ActionButton
                        action={reactivateUserAccountAction.bind(null, a.id)}
                        label="Reactivate"
                        className={ui.smallButton}
                      />
                    ) : (
                      <ActionButton
                        action={suspendUserAccountAction.bind(null, a.id)}
                        label="Suspend"
                        confirmText={`Suspend ${a.email}? They will not be able to log in.`}
                        className={ui.smallButton}
                      />
                    )}
                    <ActionButton
                      action={deleteUserAccountAction.bind(null, a.id)}
                      label="Delete"
                      confirmText={`Delete ${a.email}? This removes their profile, projects and favourites.`}
                      className={ui.dangerButton}
                    />
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
