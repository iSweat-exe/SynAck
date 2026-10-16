import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseView } from "@/components/site/course-view";
import { getCourseBySlug, getPublishedCourses } from "@/lib/courses";

// Pages are built on first visit and refreshed every minute; publishing in the CMS refreshes them at once.
export const revalidate = 60;

export async function generateStaticParams() {
  const courses = await getPublishedCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `${course.title} | SynAck`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  return <CourseView course={course} />;
}
