import { cn } from '../lib/utils'

interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section'
  heading?: string
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function AccessibleCard({
  as: Component = 'div',
  heading,
  headingLevel = 'h3',
  className,
  children,
  ...props
}: AccessibleCardProps) {
  const HeadingTag = headingLevel

  return (
    <Component
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
      {...props}
    >
      {heading && (
        <HeadingTag className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {heading}
        </HeadingTag>
      )}
      {children}
    </Component>
  )
}
