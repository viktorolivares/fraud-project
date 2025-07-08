// src/components/ui/helpers/badge-variants.ts
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        blue:
          "border-transparent bg-blue-200 text-blue-800 [a&]:hover:bg-blue-600",
        green:
          "border-transparent bg-green-200 text-green-800 [a&]:hover:bg-green-600",
        indigo:
          "border-transparent bg-indigo-200 text-indigo-800 [a&]:hover:bg-indigo-600",
        yellow:
          "border-transparent bg-yellow-400 text-black [a&]:hover:bg-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Exporta también el tipo de variantes
export type BadgeVariantsProps = VariantProps<typeof badgeVariants>;
