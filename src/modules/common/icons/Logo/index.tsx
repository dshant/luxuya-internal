import { cn } from "@lib/util/common";
import React from "react";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <>
      <img
        src='/logo.svg'
        className={cn("h-12 ", className)}
        alt='logo'
        height={"100%"}
        width={"100%"}
      />
    </>
  );
};

export default Logo;
