import { cn } from '../lib/utils'

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function ResponsiveContainer({ 
  className, 
  maxWidth = 'xl', 
  children, 
  ...props 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }

  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
