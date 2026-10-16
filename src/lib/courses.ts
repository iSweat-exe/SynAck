import config from "@payload-config";
import { getPayload } from "payload";

import type { Course } from "@/payload-types";

// The CMS is optional at read time: if the database cannot be reached (a build without a database, a
// hiccup), the site falls back to what it has instead of failing.
export async function getPublishedCourses(): Promise<Course[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "courses",
      where: { _status: { equals: "published" } },
      limit: 100,
      depth: 0,
      sort: "title",
    });
    return docs;
  } catch {
    return [];
  }
}

// A course with the diagrams of its blocks loaded (depth 1). With `draft`, the latest saved version,
// published or not (for the CMS preview).
export async function getCourseBySlug(
  slug: string,
  { draft = false }: { draft?: boolean } = {},
): Promise<Course | null> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "courses",
      where: draft
        ? { slug: { equals: slug } }
        : { slug: { equals: slug }, _status: { equals: "published" } },
      draft,
      limit: 1,
      depth: 1,
    });
    return docs[0] ?? null;
  } catch {
    return null;
  }
}
