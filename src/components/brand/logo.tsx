import Image from "next/image";

import { cn } from "@/lib/utils";

// The SynAck wordmark, from the supplied files (DESIGN.md §5): never retype it with the site font.
// `pink` has the pink "Ack" block, `dark` the near-black one. A variant for dark backgrounds, an SVG and
// the favicon are still to be produced.
const SOURCES = {
  pink: "/brand/logo-pink.png",
  dark: "/brand/logo-dark.png",
} as const;

function Logo({
  variant = "pink",
  className,
}: {
  variant?: keyof typeof SOURCES;
  className?: string;
}) {
  return (
    <Image
      src={SOURCES[variant]}
      alt="SynAck"
      width={484}
      height={185}
      className={cn("h-auto w-28", className)}
      priority
    />
  );
}

export { Logo };
