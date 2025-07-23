import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  }

  const sizes = {
    sm: 'h-9 rounded-md px-3',
    md: 'h-10 rounded-md px-4 py-2',
    lg: 'h-11 rounded-md px-8',
  }

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
