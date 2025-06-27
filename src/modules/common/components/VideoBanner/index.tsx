"use client";

import { useRouter } from "next/navigation";
import React from "react";

type BannerProps = {
  video: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  actionClassName?: string;
};

const VideoBanner = ({
  video,
  href,
  children,
}: BannerProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => href && router.push(href)}
      className={"relative flex items-center justify-center"}
    >
      <video
        src={video}
        autoPlay
        loop
        muted
        className="h-full w-full object-cover"
      />
      {children && (
        <div
          className={
            "absolute left-20 flex flex-col gap-y-2"
          
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default VideoBanner;
