import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { bannerUrl } from "@/lib/catalog";
import { ICONS } from "@/lib/catalog-icons";
import type { IconName } from "@/lib/icon-names";
import { cn } from "@/lib/utils";

// A card for a course, path, protocol, article or roadmap: a banner on top, a logo slot (the technology's
// icon) overlapping it, tags, a title and a description. Without `href` the item is not available yet.
export function ContentCard({
  title,
  description,
  tags,
  icon,
  seed,
  href,
  className,
}: {
  title: string;
  description: string;
  tags: string[];
  icon: IconName;
  seed: string;
  href?: string;
  className?: string;
}) {
  const Icon = ICONS[icon];
  const body = (
    <>
      <div className="content-card-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerUrl(seed)}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pt-0 pb-5">
        <span className="content-card-icon" aria-hidden>
          <Icon className="size-7" />
        </span>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg leading-snug font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-auto pt-2 text-xs font-bold">
          {href ? "Découvrir →" : "Bientôt disponible"}
        </p>
      </div>
    </>
  );

  const classes = cn(
    "content-card",
    href ? "content-card-link" : "content-card-soon",
    className,
  );

  return href ? (
    <Link href={href} className={classes}>
      {body}
    </Link>
  ) : (
    <article className={classes}>{body}</article>
  );
}
