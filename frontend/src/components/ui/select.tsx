import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

export function Select({ value, onValueChange, children, className }: SelectProps) {
  const [open, setOpen] = useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className={`relative inline-block w-full ${className || ''}`}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps {
  className?: string
}

export function SelectTrigger({ className }: SelectTriggerProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectTrigger must be used within Select')
  const { open, setOpen } = context
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between border bg-white p-2 rounded ${className || ''}`}      onClick={() => setOpen(!open)}
    >
      <SelectValue />
      <span>{open ? '▲' : '▼'}</span>
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectValue must be used within Select')
  const { value } = context
  return <span className={className || ''}>{value || placeholder}</span>
}

interface SelectContentProps {
  children: ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectContent must be used within Select')
  const { open } = context
  return open ? (
    <div className={`absolute z-10 mt-1 w-full bg-white border rounded shadow ${className || ''}`}>
      {children}
    </div>
  ) : null
}

interface SelectItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const context = useContext(SelectContext)
  if (!context) throw new Error('SelectItem must be used within Select')
  const { onValueChange, setOpen } = context
  return (
    <div
      className={`cursor-pointer p-2 hover:bg-gray-100 ${className || ''}`}      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
    >
      {children}
    </div>
  )
}
