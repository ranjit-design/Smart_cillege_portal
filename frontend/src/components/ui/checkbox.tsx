import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className = '' }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      className={className}
    />
  );
}
