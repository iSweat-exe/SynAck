import type { Metadata } from "next";
import { forbidden, notFound, unauthorized } from "next/navigation";

import { CourseView } from "@/components/site/course-view";
import { getCourseBySlug } from "@/lib/courses";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Aperçu | SynAck",
  robots: { index: false },
};

// The "Preview" button of the CMS: the course as it is now, draft included. Only for accounts with
// back-office access (the page is dynamic, nothing of it is cached).
export default async function PreviewCoursePage({
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

  const course = await getCourseBySlug(slug, { draft: true });
  if (!course) notFound();
  return <CourseView course={course} draft />;
}
