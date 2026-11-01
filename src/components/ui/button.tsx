import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Button — shadcn/ui structure with this project's variants (DESIGN.md §6.2).
 * Every variant defines default / hover / focus-visible / active / disabled
 * states, which the pre-delivery checklist requires.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,transform,box-shadow] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'rounded-full bg-primary text-primary-foreground hover:bg-primary-deep hover:-translate-y-px',
        ghost:
          'rounded-full border border-[rgba(11,12,16,.14)] text-foreground hover:bg-foreground hover:text-background',
        outline: 'rounded-full border border-border bg-card/70 text-foreground hover:bg-brand-50',
        glass:
          'rounded-full border border-white/15 bg-white/[0.06] text-foreground backdrop-blur-md hover:bg-white/[0.12]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-[12.5px]',
        md: 'h-11 px-5 text-[13.5px]',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-10 w-10 rounded-full',
        'icon-sm': 'h-8 w-8 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      data-slot="button"
      data-variant={variant ?? 'primary'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
