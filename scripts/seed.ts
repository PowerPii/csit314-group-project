// Generates the demo data: 100+ records for each data type.
//
//   npm run seed          -> local Supabase (run `npx supabase start` first)
//   npm run seed -- --live -> the database in SUPABASE_URL / SUPABASE_SECRET_KEY (.env.local)
//
// It deletes all existing rows first.
import { config } from "dotenv";
import { execSync } from "node:child_process";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });

const DEMO_PASSWORD = "Password123!";
const DAYS_OF_HISTORY = 90;

function connect() {
  if (process.argv.includes("--live")) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY to seed the live database");
    return { url, db: createClient(url, key) };
  }
  const status = JSON.parse(
    execSync("npx supabase status -o json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }),
  );
  return { url: status.API_URL as string, db: createClient(status.API_URL, status.SECRET_KEY) };
}

async function insert<T extends object>(db: SupabaseClient, table: string, rows: T[]) {
  const out: (T & { id: number })[] = [];
  for (let i = 0; i < rows.length; i += 500) {
    const { data, error } = await db.from(table).insert(rows.slice(i, i + 500)).select();
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...(data as (T & { id: number })[]));
  }
  console.log(`  ${table}: ${out.length}`);
  return out;
}

async function main() {
  faker.seed(314);
  const { url, db } = connect();
  console.log(`Seeding ${url}`);

  for (const table of ["project_view", "favourite", "project", "category", "company_profile", "user_account", "role"]) {
    const { error } = await db.from(table).delete().gte("id", 0);
    if (error) throw new Error(`clearing ${table}: ${error.message}`);
  }

  const roles = await insert(db, "role", [
    { name: "User Admin", description: "Manages user accounts and roles" },
    { name: "Interior Designer", description: "Showcases company profile and projects" },
    { name: "Customer", description: "Searches and saves interior design projects" },
    { name: "Platform Manager", description: "Manages categories and views reports" },
  ]);
  const roleId = (name: string) => roles.find((r) => r.name === name)!.id;
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // One known login per actor for the demo, then generated accounts.
  const fixed = [
    ["Ada Admin", "admin@demo.com", "User Admin"],
    ["Dana Designer", "designer@demo.com", "Interior Designer"],
    ["Casey Customer", "customer@demo.com", "Customer"],
    ["Morgan Manager", "manager@demo.com", "Platform Manager"],
  ].map(([name, email, role]) => ({ name, email, role_id: roleId(role) }));
  const generated = (role: string, count: number) =>
    Array.from({ length: count }, (_, i) => ({
      name: faker.person.fullName(),
      email: `${role.toLowerCase().replace(/ /g, ".")}${i + 1}@demo.com`,
      role_id: roleId(role),
    }));
  const accounts = await insert(
    db,
    "user_account",
    [
      ...fixed,
      ...generated("User Admin", 4),
      ...generated("Interior Designer", 99),
      ...generated("Customer", 99),
      ...generated("Platform Manager", 4),
    ].map((a) => ({
      ...a,
      phone: faker.helpers.replaceSymbols("+65 9### ####"),
      password_hash: passwordHash,
      is_suspended: !fixed.includes(a) && faker.datatype.boolean(0.05),
      created_at: faker.date.recent({ days: DAYS_OF_HISTORY }).toISOString(),
    })),
  );
  const designers = accounts.filter((a) => a.role_id === roleId("Interior Designer"));
  const customers = accounts.filter((a) => a.role_id === roleId("Customer"));

  await insert(
    db,
    "company_profile",
    designers.map((d) => ({
      designer_id: d.id,
      company_name: `${faker.company.name()} Interiors`,
      description: faker.company.catchPhrase(),
      contact_email: d.email,
      contact_phone: d.phone,
      service_areas: faker.helpers.arrayElements(["North", "South", "East", "West", "Central"], 2).join(", "),
      property_types: faker.helpers.arrayElements(["HDB", "Condo", "Landed", "Commercial"], 2).join(", "),
    })),
  );

  const styles = ["Modern", "Scandinavian", "Industrial", "Minimalist", "Japandi", "Contemporary", "Classic", "Rustic", "Tropical", "Luxury"];
  const rooms = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Study", "Dining Room", "Balcony", "Office", "Retail", "Whole Home"];
  const categories = await insert(
    db,
    "category",
    styles.flatMap((s) => rooms.map((r) => ({ name: `${s} ${r}`, description: `${s} design for a ${r.toLowerCase()}` }))),
  );

  const projects = await insert(
    db,
    "project",
    Array.from({ length: 300 }, () => {
      const category = faker.helpers.arrayElement(categories);
      const completed = faker.datatype.boolean(0.4);
      const priceMin = faker.number.int({ min: 10, max: 150 }) * 1000;
      const createdAt = faker.date.recent({ days: DAYS_OF_HISTORY });
      return {
        designer_id: faker.helpers.arrayElement(designers).id,
        category_id: category.id,
        title: `${category.name} at ${faker.location.street()}`,
        description: faker.lorem.paragraph(),
        status: completed ? "completed" : "current",
        style_tags: faker.helpers.arrayElements(styles, { min: 1, max: 3 }),
        price_min: priceMin,
        price_max: priceMin + faker.number.int({ min: 5, max: 50 }) * 1000,
        // Placeholder photos from picsum.photos, so the customer pages have a gallery to show.
        image_urls: Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          () => `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
        ),
        completed_at: completed ? faker.date.between({ from: createdAt, to: new Date() }).toISOString() : null,
        created_at: createdAt.toISOString(),
      };
    }),
  );

  const favourites = new Map<string, { customer_id: number; project_id: number; created_at: string }>();
  while (favourites.size < 500) {
    const customer_id = faker.helpers.arrayElement(customers).id;
    const project_id = faker.helpers.arrayElement(projects).id;
    favourites.set(`${customer_id}-${project_id}`, {
      customer_id,
      project_id,
      created_at: faker.date.recent({ days: DAYS_OF_HISTORY }).toISOString(),
    });
  }
  await insert(db, "favourite", [...favourites.values()]);

  await insert(
    db,
    "project_view",
    Array.from({ length: 3000 }, () => ({
      project_id: faker.helpers.arrayElement(projects).id,
      viewer_id: faker.datatype.boolean(0.7) ? faker.helpers.arrayElement(customers).id : null,
      viewed_at: faker.date.recent({ days: DAYS_OF_HISTORY }).toISOString(),
    })),
  );

  console.log(`Done. Demo logins (password ${DEMO_PASSWORD}): ${fixed.map((a) => a.email).join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
