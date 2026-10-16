import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// SynAck buttons (DESIGN.md §4). The look lives in globals.css (`.btn`, `.btn-primary`...): this file only
// picks the classes. `link` is an inline text link, not a boxed button, so it has no size.
const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: "btn btn-primary",
      secondary: "btn btn-secondary",
      link: "link cursor-pointer",
    },
    size: {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      "icon-sm": "btn-sm btn-icon-sm",
      icon: "btn-md btn-icon-md",
      "icon-lg": "btn-lg btn-icon-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size: variant === "link" ? null : size }),
        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
