'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ProgressiveImageProps extends ImageProps {
  wrapperClassName?: string
  skeletonClassName?: string
}

export function ProgressiveImage({
  wrapperClassName,
  skeletonClassName,
  className,
  alt,
  ...props
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative', wrapperClassName)}>
      {!loaded ? (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 animate-pulse rounded-[inherit] bg-gradient-to-br from-white/8 via-white/4 to-transparent',
            skeletonClassName
          )}
        />
      ) : null}
      <Image
        {...props}
        alt={alt}
        className={cn(
          'transition duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
