import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { ProtocolPage } from "@/components/protocols/protocol-page";
import { getProtocolView } from "@/lib/protocols";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Aperçu | SynAck",
  robots: { index: false },
};

// The "Preview" button of the CMS: the diagram as it is now, draft included. Only for accounts with
// back-office access (the page is dynamic, nothing of it is cached).
export default async function PreviewProtocolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!getSupabaseEnv()) unauthorized();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) unauthorized();
  const { data: allowed } = await supabase.rpc("has_permission", {
    p_permission: "cms.access",
  });
  if (allowed !== true) forbidden();

  const view = await getProtocolView(slug, { draft: true });
  if (!view) notFound();
  return <ProtocolPage scenario={view.scenario} badges={view.badges} draft />;
}
