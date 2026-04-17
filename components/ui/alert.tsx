import * as React from "react";

import { cn } from "@/lib/utils";

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground",
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export { Alert };
