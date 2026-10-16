import type { Metadata } from "next";

import { CatalogPage } from "@/components/site/catalog-page";
import { CATALOG } from "@/lib/catalog";
import { courseToCatalogItem } from "@/lib/course-cms";
import { getPublishedCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Parcours | SynAck",
  description:
    "Des parcours guidés pour apprendre la programmation, avec des exercices dans le navigateur.",
};

// The list is refreshed every minute; publishing in the CMS refreshes it at once.
export const revalidate = 60;

export default async function PathsPage() {
  // Courses made in the CMS first, then the planned ones that are not written yet.
  const courses = await getPublishedCourses();
  const taken = new Set(courses.map((course) => course.slug));
  const items = [
    ...courses.map(courseToCatalogItem),
    ...CATALOG.paths.filter((item) => !taken.has(item.id)),
  ];

  return (
    <CatalogPage
      title="Parcours"
      description="Des cours courts, des exercices dans le navigateur et des quiz : apprenez un langage ou une technologie pas à pas."
      section="paths"
      items={items}
    />
  );
}
