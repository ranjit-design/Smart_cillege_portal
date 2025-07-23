import React, { ReactNode } from 'react'

interface DialogProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Dialog({ children, className = '' }: DialogProps) {
  return <div className={className}>{children}</div>
}

interface DialogTriggerProps {
  children: ReactNode
  className?: string
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return <>{children}</>
}

interface DialogContentProps {
  children: ReactNode
  className?: string
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return <div className={className}>{children}</div>
}

interface DialogHeaderProps {
  children: ReactNode
  className?: string
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={className}>{children}</div>
}

interface DialogTitleProps {
  children: ReactNode
  className?: string
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return <h2 className={className}>{children}</h2>
}
