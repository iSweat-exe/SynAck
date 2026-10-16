import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProtocolPage } from "@/components/protocols/protocol-page";
import { getProtocolView, getPublishedProtocols } from "@/lib/protocols";
import { builtInSlugs } from "@/lib/protocols";

// Pages are built on first visit and refreshed every minute; publishing in the CMS refreshes them at once.
export const revalidate = 60;

export async function generateStaticParams() {
  const docs = await getPublishedProtocols();
  const slugs = new Set([...builtInSlugs(), ...docs.map((doc) => doc.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const view = await getProtocolView(slug);
  if (!view) return {};
  return {
    title: `${view.scenario.title} | SynAck`,
    description: view.scenario.summary,
  };
}

export default async function ProtocolSlugPage({ params }: Props) {
  const { slug } = await params;
  const view = await getProtocolView(slug);
  if (!view) notFound();
  return <ProtocolPage scenario={view.scenario} badges={view.badges} />;
}
