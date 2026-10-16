// Closed list of permissions (README §5 bis). Every permission that exists is declared here, so a typo
// is a type error and the list can be tested. The database only stores roles and their associations.
// Format: `resource.action`. Deny by default: no permission, no access.
export const PERMISSIONS = [
  // Learners
  "exercises.run",
  "progress.write_own",
  "review.use",
  "leaderboard.see",
  // Back office
  "cms.access",
  "courses.create",
  "courses.edit_own",
  "courses.edit",
  "courses.submit_review",
  "courses.publish",
  "courses.delete",
  "reviews.approve",
  "quiz.create",
  "articles.create",
  "articles.publish",
  "paths.manage",
  // Administration
  "users.manage",
  "roles.manage",
  "moderation.ban",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export function isPermission(value: unknown): value is Permission {
  return (
    typeof value === "string" &&
    (PERMISSIONS as readonly string[]).includes(value)
  );
}

// Starting presets, as seeded by the permissions migration. Roles are data afterwards: an administrator
// can edit them, so this table documents the starting point and is not read at runtime.
// Every account also holds the `member` role; instructors hold it in addition to their own.
const MEMBER = [
  "exercises.run",
  "progress.write_own",
  "review.use",
  "leaderboard.see",
] as const satisfies readonly Permission[];

const JUNIOR_INSTRUCTOR = [
  "cms.access",
  "courses.create",
  "courses.edit_own",
  "courses.submit_review",
  "quiz.create",
  "articles.create",
] as const satisfies readonly Permission[];

const SENIOR_INSTRUCTOR = [
  ...JUNIOR_INSTRUCTOR,
  "courses.edit",
  "courses.publish",
  "reviews.approve",
  "articles.publish",
  "paths.manage",
] as const satisfies readonly Permission[];

export const PRESETS = {
  member: MEMBER,
  junior_instructor: JUNIOR_INSTRUCTOR,
  senior_instructor: SENIOR_INSTRUCTOR,
  // The administrator holds every permission.
  administrator: PERMISSIONS,
} as const satisfies Record<string, readonly Permission[]>;

export type PresetName = keyof typeof PRESETS;
