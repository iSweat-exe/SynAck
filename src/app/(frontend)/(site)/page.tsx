import { ContentCard } from "@/components/site/content-card";
import { Badge } from "@/components/ui/badge";
import type { IconName } from "@/lib/icon-names";

const SECTIONS: {
  href: string;
  title: string;
  description: string;
  tags: string[];
  icon: IconName;
}[] = [
  {
    href: "/paths",
    title: "Parcours",
    description: "Des cours courts et des exercices dans le navigateur.",
    tags: ["Cours", "Exercices"],
    icon: "binary",
  },
  {
    href: "/protocols",
    title: "Protocoles",
    description: "TCP, HTTP, DNS et TLS, animés et interactifs.",
    tags: ["Réseau", "Interactif"],
    icon: "network",
  },
  {
    href: "/articles",
    title: "Articles",
    description: "La veille technique, en articles courts.",
    tags: ["Veille"],
    icon: "newspaper",
  },
  {
    href: "/roadmaps",
    title: "Cursus",
    description: "Des feuilles de route pour viser un métier.",
    tags: ["Roadmaps"],
    icon: "layers",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
      <section className="flex max-w-2xl flex-col gap-4">
        <Badge variant="primary" className="self-start">
          Bêta
        </Badge>
        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          Apprenez en pratiquant.
        </h1>
        <p className="text-lg text-muted-foreground">
          Programmation et protocoles réseau, gratuitement, directement dans
          votre navigateur. Les premiers cours arrivent bientôt.
        </p>
      </section>

      <section aria-labelledby="explore" className="flex flex-col gap-6">
        <h2 id="explore" className="text-xl font-bold">
          Explorer
        </h2>
        <ul className="grid gap-8 pr-2 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map(({ href, ...section }) => (
            <li key={href} className="flex">
              <ContentCard
                {...section}
                href={href}
                seed={`home-${href}`}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
