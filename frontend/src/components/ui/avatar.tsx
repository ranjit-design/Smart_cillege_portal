import React, { ReactNode } from 'react'

interface AvatarProps {
  children: ReactNode
  className?: string
}

export function Avatar({ children, className = '' }: AvatarProps) {
  return <div className={className}>{children}</div>
}

interface AvatarFallbackProps {
  children: ReactNode
  className?: string
}

export function AvatarFallback({ children, className = '' }: AvatarFallbackProps) {
  return <span className={className}>{children}</span>
}
