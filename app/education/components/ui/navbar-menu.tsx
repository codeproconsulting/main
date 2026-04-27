"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { cn } from "~/education/lib/utils";

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


export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link to={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl bg-gray-100 object-cover"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const StudentServiceItem = ({
  title,
  href,
  image,
}: {
  title: string;
  href: string;
  image: string;
}) => {
  return (
    <Link
      to={href}
      className="group flex flex-col flex-1 min-w-[100px] max-w-[180px] rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-lg transition-all bg-white dark:bg-slate-900/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-white text-xs font-medium text-center px-2">Your image</span>
        )}
      </div>
      <div className="p-3 flex-shrink-0">
        <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors text-center">
          {title}
        </h4>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black hover:font-bold transition-all"
    >
      {children}
    </Link>
  );
};

export const DestinationItem = ({
  name,
  image,
  href,
  tag,
}: {
  name: string;
  image: string;
  href: string;
  tag?: string;
}) => {
  return (
    <Link
      to={href}
      className="group flex flex-col flex-1 min-w-[100px] max-w-[180px] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700 hover:border-pink-200 dark:hover:border-pink-900/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {tag && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-[10px] font-semibold text-slate-700 dark:text-white shadow-sm">
            {tag}
          </span>
        )}
      </div>
      <span className="p-3 text-center text-base font-bold text-slate-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
        {name}
      </span>
    </Link>
  );
};
