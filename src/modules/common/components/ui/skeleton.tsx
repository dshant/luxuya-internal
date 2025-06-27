import { cn } from "@lib/util/common";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-gray-100 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
