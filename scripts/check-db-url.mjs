// Checks the shape of SUPABASE_DB_URL before `supabase db push`, so a bad secret
// fails with a clear message. Never prints the password itself.
const raw = process.env.SUPABASE_DB_URL ?? "";
const problems = [];

if (raw !== raw.trim()) problems.push("has spaces or line breaks at the start or end");

let url;
try {
  url = new URL(raw.trim());
} catch {
  console.error("SUPABASE_DB_URL is not a valid URL. Copy the Session pooler string from Supabase > Connect.");
  process.exit(1);
}

const password = decodeURIComponent(url.password);
const ref = url.username.split(".")[1] ?? "";

if (!url.hostname.endsWith(".pooler.supabase.com")) problems.push("host is not a Session pooler host (*.pooler.supabase.com)");
if (url.port !== "5432") problems.push(`port is ${url.port || "missing"}, Session pooler uses 5432`);
if (!/^postgres\.[a-z0-9]{20}$/.test(url.username)) problems.push("user should be postgres.<project-ref>");
if (!password) problems.push("password is empty");
if (/YOUR-PASSWORD|[[\]]/i.test(password)) problems.push("password still contains the [YOUR-PASSWORD] placeholder or brackets");

console.log(`host: ${url.hostname}`);
console.log(`port: ${url.port}`);
console.log(`user: postgres.${ref ? `${ref.slice(0, 4)}…` : "(none)"}`);
console.log(`password: ${password.length} characters`);

if (problems.length) {
  console.error(`SUPABASE_DB_URL problems:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("SUPABASE_DB_URL looks well formed.");
