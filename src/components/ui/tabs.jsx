import React, { createContext, useContext } from "react";

const TabsContext = createContext(null);

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs({ value, onValueChange, className = "", children }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", ...props }) {
  return <div className={cn("flex gap-1", className)} {...props} />;
}

export function TabsTrigger({ value, className = "", children, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.onValueChange?.(value)}
      className={cn(
        "px-3 py-2 text-sm transition",
        active ? "bg-white shadow text-slate-900" : "text-slate-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}