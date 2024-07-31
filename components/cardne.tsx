import { PropsWithChildren } from "react";
import classNames from "classnames";

interface CardNEProps extends PropsWithChildren {
  className?: string;
}

// stands for card with no effects
export const CardNE: React.FC<CardNEProps> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "relative duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-100/100 border-zinc-600",
        className
      )}
    >
      {children}
    </div>
  );
};
