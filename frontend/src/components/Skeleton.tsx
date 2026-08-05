import { cn } from '../lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text'
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 w-full',
        className
      )}
      {...props}
    />
  )
}
