import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  delay = 0,
  children,
  onClick,
}: {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
  delay?: number;
  children?: ReactNode;
  onClick?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    key={name}
    onClick={onClick}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-3xl",
      // light styles
      "bg-white border border-slate-200 shadow-sm",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-none flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-10 w-10 origin-left transform-none text-slate-900 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-black text-slate-800 tracking-tight">
        {name}
      </h3>
      <p className="max-w-lg text-slate-500 font-medium leading-relaxed">{description}</p>
      {children}
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-none flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <button className="pointer-events-auto flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-[#D3DFF2] shadow-lg">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-none transition-all duration-300 group-hover:bg-black/[0.03]" />
  </motion.div>
);
