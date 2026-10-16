import Link from "next/link";

import { SequenceDiagram } from "@/components/protocols/sequence-diagram";
import { RichTextContent } from "@/components/site/rich-text";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { courseChapters } from "@/lib/course-cms";
import type { Course } from "@/payload-types";

// A course page: the title and summary, the list of chapters on the side (a sticky table of contents on
// wide screens), then every chapter with its blocks: text, and protocol diagrams that play in place.
export function CourseView({
  course,
  draft = false,
}: {
  course: Course;
  draft?: boolean;
}) {
  const chapters = courseChapters(course, { allowDraftDiagrams: draft });
  const badges = [course.level, ...(course.tags ?? [])].filter(
    (badge): badge is string => Boolean(badge),
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <header className="flex max-w-3xl flex-col gap-4">
        <Link href="/paths" className="link self-start text-sm">
          ← Parcours
        </Link>
        <h1 className="text-4xl leading-tight font-bold tracking-tight">
          {course.title}
        </h1>
        {badges.length > 0 || draft ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
            {draft ? <Badge variant="warning">Brouillon</Badge> : null}
          </div>
        ) : null}
        {course.summary ? (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {course.summary}
          </p>
        ) : null}
      </header>

      {chapters.length === 0 ? (
        <Alert variant="info" title="Bientôt">
          Ce cours n&apos;a pas encore de chapitre.
        </Alert>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <nav
            aria-label="Chapitres"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-3 text-xs font-bold text-muted-foreground">
              Chapitres
            </p>
            <ol className="flex flex-col gap-1 border-l-2 border-dashed border-border pl-4">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#chapter-${chapter.number}`}
                    className="block py-1 text-sm font-bold hover:underline"
                  >
                    {chapter.number}. {chapter.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex min-w-0 flex-col gap-14">
            {chapters.map((chapter) => (
              <section
                key={chapter.id}
                id={`chapter-${chapter.number}`}
                aria-labelledby={`chapter-title-${chapter.number}`}
                className="flex scroll-mt-24 flex-col gap-6"
              >
                <h2
                  id={`chapter-title-${chapter.number}`}
                  className="border-b-2 border-border pb-3 text-2xl font-bold"
                >
                  {chapter.number}. {chapter.title}
                </h2>

                {chapter.blocks.map((block) =>
                  block.kind === "text" ? (
                    <RichTextContent key={block.id} data={block.body} />
                  ) : (
                    <figure
                      key={block.id}
                      className="flex flex-col gap-3 rounded-lg border-2 border-border bg-card p-5 [--diagram-bg:var(--surface)]"
                    >
                      <SequenceDiagram scenario={block.scenario} />
                      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                        <span>Schéma : {block.scenario.title}</span>
                        <Link
                          href={`/protocols/${block.slug}`}
                          className="link text-sm"
                        >
                          Plein écran →
                        </Link>
                      </figcaption>
                    </figure>
                  ),
                )}
              </section>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
