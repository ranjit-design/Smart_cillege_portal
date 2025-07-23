import React from 'react'

interface SwitchProps {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function Switch({ checked, onCheckedChange, className = '' }: SwitchProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className={className}
    />
  )
}
