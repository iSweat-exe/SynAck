import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";
import { CATALOG } from "@/lib/catalog";
import { protocolToCatalogItem } from "@/lib/protocol-cms";
import { getPublishedProtocols } from "@/lib/protocols";

export const metadata: Metadata = {
  title: "Protocoles | SynAck",
  description:
    "Des modules interactifs pour comprendre TCP, HTTP, DNS et TLS, paquet par paquet.",
};

// The list is refreshed every minute; publishing in the CMS refreshes it at once.
export const revalidate = 60;

export default async function ProtocolsPage() {
  // Diagrams made in the CMS first, then the planned ones that are not written yet.
  const docs = await getPublishedProtocols();
  const taken = new Set(docs.map((doc) => doc.slug));
  const items = [
    ...docs.map(protocolToCatalogItem),
    ...CATALOG.protocols.filter((item) => !taken.has(item.id)),
  ];

  return (
    <CatalogPage
      title="Protocoles"
      description="Comprenez ce qui se passe vraiment sur le réseau : des animations et des bacs à sable pour TCP, HTTP, DNS et TLS."
      section="protocols"
      items={items}
    />
  );
}
