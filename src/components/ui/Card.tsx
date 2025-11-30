// ============================================
// CARD - Kartica kontejner
// ============================================
//
// VARIJANTE:
// - default: Bela sa blagom senkom
// - bordered: Sa vidljivim okvirom
// - elevated: Jača senka za isticanje
//
// SUB-KOMPONENTE:
// - CardHeader: Zaglavlje sa naslovom
// - CardTitle: Naslov
// - CardDescription: Opis
// - CardContent: Glavni sadržaj
// - CardFooter: Podnožje za akcije
//
// DARK MODE: Sve komponente podržavaju tamnu temu
// ============================================

"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    const variants = {
      default:
        "bg-white dark:bg-[#4e577a] border border-gray-100 dark:border-slate-600 shadow-sm",
      bordered:
        "bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-500",
      elevated: "bg-white dark:bg-slate-700 shadow-lg dark:shadow-slate-900/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-colors duration-300",
          variants[variant],
          hover && "hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card Header
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-6 pb-0", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-300 mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-3 p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
