import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500",
        className
      )}
      {...props}
    />
  );
}