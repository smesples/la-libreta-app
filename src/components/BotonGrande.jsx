import React from 'react';
import { cn } from "@/lib/utils";

export default function BotonGrande({ 
  children, 
  onClick, 
  variant = "primary", 
  icon: Icon,
  className 
}) {
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-5 px-6 rounded-2xl font-semibold text-lg",
        "flex items-center justify-center gap-3",
        "transition-all duration-200 active:scale-[0.98]",
        "shadow-sm hover:shadow-md",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="w-6 h-6" />}
      {children}
    </button>
  );
}
