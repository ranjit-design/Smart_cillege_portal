import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded'
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
  }

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
