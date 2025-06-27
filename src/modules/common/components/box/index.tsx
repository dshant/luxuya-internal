import { Slot } from '@lib/util/slot'
import * as React from 'react'



export type BoxProps<T extends React.ElementType = 'div'> = {
  as?: T
  asChild?: boolean
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

export function Box<T extends React.ElementType = 'div'>({
  as,
  asChild,
  children,
  ...props
}: BoxProps<T>) {
  const Component = asChild ? Slot : as || 'div'

  return <Component {...props}>{children}</Component>
}
