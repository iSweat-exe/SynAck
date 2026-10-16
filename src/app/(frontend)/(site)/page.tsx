import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const SOON = [
  { title: "Introduction à la programmation", tag: "Parcours" },
  { title: "Le handshake TCP, en vrai", tag: "Protocoles" },
  { title: "Veille technique", tag: "Articles" },
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

      <section aria-labelledby="soon" className="flex flex-col gap-6">
        <h2 id="soon" className="text-xl font-bold">
          Bientôt disponible
        </h2>
        <ul className="grid gap-8 pr-2 sm:grid-cols-2 lg:grid-cols-3">
          {SOON.map(({ title, tag }) => (
            <li key={title}>
              <Card className="h-full border-dashed shadow-none">
                <Badge variant="secondary" className="self-start">
                  {tag}
                </Badge>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>
                  En préparation : le contenu apparaîtra ici.
                </CardDescription>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
