"use client";

// ============================================
// SELECT - Dropdown meni
// ============================================
//
// FEATURES:
// - Lista opcija
// - Placeholder
// - Error state
// - Disabled state
// - Ikona strelice
//
// PRIMER:
// <Select
//   label="Tip uređaja"
//   options={[
//     { value: 'BARRIER', label: 'Rampa' },
//     { value: 'GATE', label: 'Kapija' },
//   ]}
//   value={selected}
//   onChange={handleChange}
// />
// ============================================

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-600 text-gray-900 dark:text-white",
              "appearance-none cursor-pointer pr-10",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:border-transparent",
              "disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-gray-500",
              error
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-gray-200 dark:border-slate-500 hover:border-gray-300 dark:hover:border-slate-400 focus:ring-blue-500/20 focus:border-blue-500",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
