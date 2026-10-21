import { requireRole } from "@/lib/session";
import { ActorHeader } from "../ActorHeader";

export default async function DesignerHomeBoundary() {
  const session = await requireRole("Interior Designer");

  return (
    <>
      <ActorHeader title="Interior Designer" name={session.name} />
      <main className="p-6">
        <p>Stories for this actor go here.</p>
      </main>
    </>
  );
}
