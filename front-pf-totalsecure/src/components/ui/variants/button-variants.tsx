import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white hover:bg-red-700",
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200 dark:focus-visible:ring-red-400 dark:bg-red-700/80",
        outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700/80",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600/80",
        ghost: "hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-700/80 dark:text-gray-100",
        link: "underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-400 text-gray-900 hover:bg-yellow-500",
        info: "bg-cyan-600 text-white hover:bg-cyan-700",
        error: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200 dark:focus-visible:ring-red-400 dark:bg-red-700/80",
        light: "bg-gray-50 text-gray-900 hover:bg-gray-100",
        dark: "bg-gray-900 text-white hover:bg-gray-800",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xs: "h-6 px-2 text-xs rounded",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
