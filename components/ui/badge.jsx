import React from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "border border-zinc-900 bg-zinc-900 text-white",
  secondary: "border border-zinc-200 bg-zinc-100 text-zinc-800",
  outline: "border border-zinc-200 bg-white text-zinc-700",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
