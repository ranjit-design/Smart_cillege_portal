import React, { createContext, useContext, useState, ReactNode } from 'react'

interface TabsContextType {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}
export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}
export function TabsList({ children, className }: TabsListProps) {
  return (
    <div role="tablist" className={className}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}
export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }
  const selected = context.value === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={className}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}
export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }
  return context.value === value ? (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  ) : null
}
