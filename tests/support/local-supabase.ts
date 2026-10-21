import { execSync } from "node:child_process";

// Point the entity classes at the local Supabase started by `npx supabase start`.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  const status = JSON.parse(execSync("npx supabase status -o json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  process.env.SUPABASE_URL = status.API_URL;
  process.env.SUPABASE_SECRET_KEY = status.SECRET_KEY;
}

if (!process.env.SUPABASE_URL?.includes("127.0.0.1") && !process.env.SUPABASE_URL?.includes("localhost")) {
  throw new Error("Integration tests only run against a local Supabase, never the live database.");
}
