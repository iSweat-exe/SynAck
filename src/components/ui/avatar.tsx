import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  const parts = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters || "?";
}

// SynAck avatar: the account picture in a round outlined frame, or the initials on the main color when
// there is no picture. The picture comes from the sign-in provider (GitHub, Discord), so it is a plain
// <img> rather than next/image (no remote host to configure).
function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <span
      data-slot="avatar"
      className={cn("avatar", className)}
      style={{ "--avatar-size": `${size}px` } as CSSProperties}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" referrerPolicy="no-referrer" />
      ) : (
        <span aria-hidden>{initialsOf(name)}</span>
      )}
    </span>
  );
}

export { Avatar };
