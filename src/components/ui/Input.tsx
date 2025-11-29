"use client";

// ============================================
// INPUT - Polje za unos teksta
// ============================================
//
// FEATURES:
// - Label iznad polja
// - Error poruka ispod
// - Hint tekst za pomoć
// - Ikona levo (opciono)
// - Animacija focus state-a
//
// PRIMER:
// <Input
//   label="Email"
//   error={errors.email}
//   hint="Koristite poslovni email"
// />
// ============================================

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-600 text-gray-900 dark:text-white",
              "placeholder:text-gray-400 dark:placeholder:text-gray-400",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              "disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-400",
              leftIcon && "pl-10",
              error
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200 dark:border-slate-500 hover:border-gray-300 dark:hover:border-slate-400 focus:ring-blue-500/20 focus:border-blue-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
