import { cn } from "@lib/util/common";
import React from "react";

type TypographyMutedProps = {
  children: React.ReactNode;
  className?: string;
};

const TypographyMuted = ({ children, className }: TypographyMutedProps) => {
  return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
};

export default TypographyMuted;
