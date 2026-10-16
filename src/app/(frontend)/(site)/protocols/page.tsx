import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";

export const metadata: Metadata = {
  title: "Protocoles | SynAck",
  description:
    "Des modules interactifs pour comprendre TCP, HTTP, DNS et TLS, paquet par paquet.",
};

export default function ProtocolsPage() {
  return (
    <CatalogPage
      title="Protocoles"
      description="Comprenez ce qui se passe vraiment sur le réseau : des animations et des bacs à sable pour TCP, HTTP, DNS et TLS."
      section="protocols"
    />
  );
}
