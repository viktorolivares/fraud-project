// src/components/ui/Badge.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import {
  badgeVariants,
  type BadgeVariantsProps,
} from "./variants/badge-variants";

interface BadgeProps extends React.ComponentProps<"span">, BadgeVariantsProps {
  asChild?: boolean;
}

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
