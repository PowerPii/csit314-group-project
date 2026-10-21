import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";

export default async function PlatformManagerHomeBoundary() {
  const session = await requireRole("Platform Manager");

  return (
    <>
      <ActorHeader title="Platform Manager" name={session.name} />
      <main className="p-6">
        <p>Stories for this actor go here.</p>
      </main>
    </>
  );
}
