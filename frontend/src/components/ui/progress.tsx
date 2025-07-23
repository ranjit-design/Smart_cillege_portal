import React from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  className?: string
}

export function Progress({ value, className = '', ...props }: ProgressProps) {
  return (
    <div
      className={`w-full bg-gray-200 rounded h-2 overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
