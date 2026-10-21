import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";

export default async function CustomerHomeBoundary() {
  const session = await requireRole("Customer");

  return (
    <>
      <ActorHeader title="Customer" name={session.name} />
      <main className="p-6">
        <p>Stories for this actor go here.</p>
      </main>
    </>
  );
}
