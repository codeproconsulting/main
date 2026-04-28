"use client";

import { motion } from "framer-motion";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { cn } from "~/immigration/lib/utils";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav className="relative flex bg-transparent justify-center items-center gap-x-4 px-1 py-2">
      {children}
    </nav>
  );
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const isOpen = active === item;
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap lg:text-base",
          isOpen ? "text-black" : "text-neutral-700 dark:text-neutral-200 hover:text-black"
        )}
      >
        {item}
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200 lg:h-4 lg:w-4", isOpen && "rotate-180")}
          aria-hidden
        />
      </motion.p>
      {active === item && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 h-3 w-[480px]"
          aria-hidden
        />
      )}
      {active !== null && children != null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_0.5rem)] left-1/2 -translate-x-1/2 pt-1">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-black/30"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const HoveredLink = ({ children, ...rest }: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black hover:font-bold transition-all"
    >
      {children}
    </Link>
  );
};
