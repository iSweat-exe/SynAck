// Health probe used by the uptime monitor, keepalive.yml and db-migrate.yml.
// TODO (P4.4): add a light database query so it also keeps Supabase from pausing.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" });
}
