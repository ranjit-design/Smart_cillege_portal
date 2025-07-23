import React from 'react'

interface CalendarProps {
  mode?: string
  selected?: Date
  onSelect?: (date: Date) => void
  initialFocus?: boolean
  className?: string
}

export function Calendar({ selected, onSelect, className = '' }: CalendarProps) {
  return (
    <input
      type="date"
      className={className}
      value={selected ? selected.toISOString().slice(0, 10) : ''}
      onChange={e => {
        const date = e.target.valueAsDate
        if (date && onSelect) onSelect(date)
      }}
    />
  )
}
