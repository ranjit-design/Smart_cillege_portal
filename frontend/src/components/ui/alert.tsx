import React, { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  className?: string
}

export function Alert({ children, className = '' }: AlertProps) {
  return <div className={`border border-red-500 bg-red-50 p-4 rounded ${className}`}>{children}</div>
}

interface AlertDescriptionProps {
  children: ReactNode
  className?: string
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return <p className={`text-sm text-red-700 ${className}`}>{children}</p>
}
