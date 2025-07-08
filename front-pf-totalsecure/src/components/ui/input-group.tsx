import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, left, right, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative flex items-center", className)} {...props}>
        {left && (
          <span className="absolute left-3 flex items-center h-full text-muted-foreground">
            {left}
          </span>
        )}

        {React.Children.map(children, child => {
          if (React.isValidElement<React.ComponentPropsWithoutRef<"input">>(child)) {
            return React.cloneElement(child, {
              className: cn(
                child.props.className,
                left ? "pl-10" : "",
                right ? "pr-10" : ""
              ),
            });
          }
          return child;
        })}

        {right && (
          <span className="absolute right-3 flex items-center h-full text-muted-foreground">
            {right}
          </span>
        )}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";
