/// <reference types="vite/client" />

declare namespace React {
  interface HTMLAttributes<T> {
    popover?: "auto" | "manual" | "" | undefined;
  }
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string | undefined;
    popovertargetaction?: "hide" | "show" | "toggle" | undefined;
  }
}
