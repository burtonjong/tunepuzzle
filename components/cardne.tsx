"use client";

import { PropsWithChildren } from "react";

// stands for card with no effects

export const CardNE: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="overflow-hidden relative duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-100/100 border-zinc-600 ">
      {children}
    </div>
  );
};
