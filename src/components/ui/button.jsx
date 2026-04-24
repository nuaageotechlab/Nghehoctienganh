import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className = "",
  variant = "default",
  type = "button",
  ...props
}) {
  const styles = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition",
        styles[variant] || styles.default,
        className
      )}
      {...props}
    />
  );
}