import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-white",
  {
    variants: {
      variant: {
        default: "bg-stone-950 px-5 py-2.5 text-white hover:bg-stone-800 focus-visible:ring-stone-950",
        secondary: "bg-white px-5 py-2.5 text-stone-900 ring-1 ring-stone-200 hover:bg-stone-50 focus-visible:ring-stone-400",
        ghost: "px-4 py-2 text-stone-700 hover:bg-stone-100 focus-visible:ring-stone-400",
        destructive: "bg-red-600 px-5 py-2.5 text-white hover:bg-red-500 focus-visible:ring-red-500",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
