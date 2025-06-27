import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/util/common";

const badgeVariants = cva(
  "inline-flex items-center border cursor-pointer rounded-full whitespace-nowrap border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/80",
        primary: "bg-primary text-gray-900 hover:bg-primary-400",
        outline: "text-gray-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
