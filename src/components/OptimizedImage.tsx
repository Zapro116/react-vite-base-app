import React, { useState, useRef, useEffect } from 'react';
import { Image, Skeleton, Box } from '@mantine/core';
import {
  generatePlaceholder,
  createLazyLoadObserver,
  supportsImageFormat,
} from '@/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  placeholder?: string;
  fallbackSrc?: string;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  lazy = true,
  placeholder,
  fallbackSrc,
  sizes,
  srcSet,
  priority = false,
  onLoad,
  onError,
  style,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate placeholder if not provided
  const defaultPlaceholder =
    placeholder || (width && height ? generatePlaceholder(width, height) : '');

  // Determine the best image format to use
  const getOptimizedSrc = (originalSrc: string): string => {
    if (supportsImageFormat('avif') && originalSrc.includes('.jpg')) {
      return originalSrc.replace('.jpg', '.avif');
    }
    if (
      supportsImageFormat('webp') &&
      (originalSrc.includes('.jpg') || originalSrc.includes('.png'))
    ) {
      return originalSrc.replace(/\.(jpg|png)$/, '.webp');
    }
    return originalSrc;
  };

  // Set up lazy loading observer
  useEffect(() => {
    if (!lazy || priority || !containerRef.current) return;

    const observer = createLazyLoadObserver(entry => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [lazy, priority]);

  // Update src when in view
  useEffect(() => {
    if (isInView && !currentSrc) {
      setCurrentSrc(getOptimizedSrc(src));
    }
  }, [isInView, src, currentSrc]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Set up error handling for the image element
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.onerror = () => {
        setHasError(true);
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          setHasError(false);
        } else {
          onError?.();
        }
      };
    }
  }, [fallbackSrc, currentSrc, onError]);

  return (
    <Box
      ref={containerRef}
      style={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        ...style,
      }}
      className={className}
    >
      {/* Placeholder/Loading state */}
      {!isLoaded && !hasError && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          {defaultPlaceholder ? (
            <img
              src={defaultPlaceholder}
              alt=''
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(4px)',
              }}
            />
          ) : (
            <Skeleton width={width || '100%'} height={height || 200} animate />
          )}
        </Box>
      )}

      {/* Main image */}
      {isInView && currentSrc && !hasError && (
        <Image
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={srcSet}
          onLoad={handleLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}

      {/* Error state */}
      {hasError && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: height || 200,
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
}

// Higher-order component for responsive images
interface ResponsiveImageProps
  extends Omit<OptimizedImageProps, 'srcSet' | 'sizes'> {
  basePath: string;
  breakpoints?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function ResponsiveImage({
  basePath,
  breakpoints = { mobile: 320, tablet: 768, desktop: 1200 },
  ...props
}: ResponsiveImageProps) {
  const extension = basePath.split('.').pop();
  const pathWithoutExt = basePath.replace(`.${extension}`, '');

  const srcSet = [
    `${pathWithoutExt}-${breakpoints.mobile}w.${extension} ${breakpoints.mobile}w`,
    `${pathWithoutExt}-${breakpoints.tablet}w.${extension} ${breakpoints.tablet}w`,
    `${pathWithoutExt}-${breakpoints.desktop}w.${extension} ${breakpoints.desktop}w`,
  ].join(', ');

  const sizes = `
    (max-width: ${breakpoints.mobile}px) ${breakpoints.mobile}px,
    (max-width: ${breakpoints.tablet}px) ${breakpoints.tablet}px,
    ${breakpoints.desktop}px
  `;

  return (
    <OptimizedImage {...props} src={basePath} srcSet={srcSet} sizes={sizes} />
  );
}

// Component for hero/banner images with priority loading
export function HeroImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority lazy={false} />;
}

// Component for avatar/profile images with circular crop
interface AvatarImageProps extends OptimizedImageProps {
  size?: number;
}

export function AvatarImage({ size = 40, style, ...props }: AvatarImageProps) {
  return (
    <OptimizedImage
      {...props}
      width={size}
      height={size}
      style={{
        borderRadius: '50%',
        ...style,
      }}
    />
  );
}
