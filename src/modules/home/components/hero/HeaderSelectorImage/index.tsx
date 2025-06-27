import { cn } from "@lib/util/common";
import { motion } from "framer-motion";
import React from "react";

type HeaderSelectorImageProps = {
  image: string;
  children: React.ReactNode;
  className?: string;
};

const HeaderSelectorImage = ({
  image,
  children,
  className,
}: HeaderSelectorImageProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative flex cursor-pointer items-center justify-center",
        className,
      )}
    >
      <img
        src={image}
        className="h-full w-full overflow-hidden rounded-xl object-cover"
        alt="heroImage"
        height={"100%"}
        width={"100%"}
      />
      <div className="absolute">{children} </div>
    </motion.div>
  );
};

export default HeaderSelectorImage;
