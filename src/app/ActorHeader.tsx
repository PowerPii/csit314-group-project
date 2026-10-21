import { LogoutButton } from "./logout/LogoutButton";

export function ActorHeader({ title, name }: { title: string; name?: string }) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        {name && <span>{name}</span>}
        <LogoutButton />
      </div>
    </header>
  );
}
