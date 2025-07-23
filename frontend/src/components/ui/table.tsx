import React from 'react'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export function Table({ className = '', ...props }: TableProps) {
  return <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props} />
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableHeader({ className = '', ...props }: TableHeaderProps) {
  return <thead className={className} {...props} />
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableBody({ className = '', ...props }: TableBodyProps) {
  return <tbody className={className} {...props} />
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export function TableRow({ className = '', ...props }: TableRowProps) {
  return <tr className={className} {...props} />
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}
export function TableHead({ className = '', ...props }: TableHeadProps) {
  return <th className={`px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props} />
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {}
export function TableCell({ className = '', ...props }: TableCellProps) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props} />
}
