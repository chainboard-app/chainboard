import { cn } from '../lib/utils'

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function AccessibleInput({
  label,
  error,
  helperText,
  id,
  className,
  ...props
}: AccessibleInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}
