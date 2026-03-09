import React from 'react';
import { cn } from "@/lib/utils";
import { Lock } from 'lucide-react';

export default function TarjetaResumen({ 
  titulo, 
  valor, 
  icon: Icon, 
  color = "emerald",
  subtitulo 
}) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };

  const iconColors = {
    emerald: "bg-emerald-100 text-emerald-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <div className={cn(
      "p-5 rounded-2xl border-2",
      colors[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{titulo}</p>
          <p className="text-2xl font-bold mt-1">${valor.toLocaleString()}</p>
          {subtitulo && (
            <p className="text-xs mt-1 opacity-60">{subtitulo}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-3 rounded-xl", iconColors[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-current border-opacity-10 flex items-center gap-1 opacity-40">
        <Lock className="w-3 h-3" />
        <p className="text-xs">Registro protegido · Listo para certificar</p>
      </div>
    </div>
  );
}
