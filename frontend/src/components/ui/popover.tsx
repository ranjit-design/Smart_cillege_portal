import React, { ReactNode, HTMLAttributes } from 'react'

interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function Popover({ children, className = '', ...props }: PopoverProps) {
  return <div className={className} {...props}>{children}</div>
}

interface PopoverTriggerProps {
  children: ReactNode
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  return <>{children}</>
}

interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

export function PopoverContent({ children, className = '', ...props }: PopoverContentProps) {
  return <div className={className} {...props}>{children}</div>
}
