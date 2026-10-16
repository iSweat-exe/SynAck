import type { Metadata } from "next";
import Link from "next/link";

import { SequenceDiagram } from "@/components/protocols/sequence-diagram";
import { Badge } from "@/components/ui/badge";
import { tcpHandshake } from "@/lib/scenarios/tcp-handshake";

export const metadata: Metadata = {
  title: "TCP : le handshake | SynAck",
  description:
    "Le handshake TCP en trois messages, animé pas à pas, avec une perte de paquet à simuler.",
};

export default function TcpPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4">
        <Link href="/protocols" className="link self-start text-sm">
          ← Protocoles
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl leading-tight font-bold tracking-tight">
            {tcpHandshake.title}
          </h1>
          <Badge variant="secondary">Transport</Badge>
          <Badge variant="secondary">Animé</Badge>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {tcpHandshake.summary}
        </p>
      </header>

      <SequenceDiagram scenario={tcpHandshake} />

      <section className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-xl font-bold">À essayer</h2>
        <p className="leading-relaxed text-muted-foreground">
          Activez « Simuler une perte de paquet » et relancez : le SYN-ACK se
          perd, le serveur attend, puis il le renvoie. C&apos;est la raison
          d&apos;être des numéros de séquence et des accusés de réception : TCP
          fabrique une communication fiable au-dessus d&apos;un réseau qui ne
          l&apos;est pas.
        </p>
      </section>
    </main>
  );
}
