// src/components/icons/LogoTortugaWordmark.tsx
import * as React from "react";
import LogoTortuga, { LogoTortugaProps } from "./LogoTortuga";

type Props = {
  text?: string;
  className?: string; // aplica al wrapper
  iconProps?: LogoTortugaProps; // pasa props al SVG
};

export default function LogoTortugaWordmark({
  text = "Tamul",
  className,
  iconProps,
}: Props) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoTortuga
        aria-hidden
        className="w-7 h-7 shrink-0 text-emerald-600 dark:text-emerald-400"
        {...iconProps}
      />
      <span className="font-semibold tracking-tight text-foreground">
        {text}
      </span>
    </div>
  );
}
