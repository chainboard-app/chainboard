import React from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
}

export function PageLoader({ message = 'Loading...', fullScreen = false }: PageLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return <div className="flex min-h-[200px] items-center justify-center">{content}</div>
}
