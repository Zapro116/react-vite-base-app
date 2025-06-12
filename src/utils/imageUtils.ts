/**
 * Image utility functions for handling images, lazy loading, and optimization
 */

import { map, forEach } from 'lodash-es';

// Image loading utilities
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload images
export const preloadImages = async (
  urls: string[]
): Promise<HTMLImageElement[]> => {
  try {
    const promises = map(urls, url => loadImage(url));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error preloading images:', error);
    return [];
  }
};

// Generate responsive image srcSet
export const generateSrcSet = (
  basePath: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string => {
  return map(sizes, size => {
    const extension = basePath.split('.').pop();
    const pathWithoutExt = basePath.replace(`.${extension}`, '');
    return `${pathWithoutExt}-${size}w.${extension} ${size}w`;
  }).join(', ');
};

// Get optimized image URL based on device pixel ratio
export const getOptimizedImageUrl = (
  basePath: string,
  width: number,
  format: 'webp' | 'avif' | 'jpg' | 'png' = 'webp'
): string => {
  const dpr = window.devicePixelRatio || 1;
  const optimizedWidth = Math.round(width * dpr);
  const extension = basePath.split('.').pop();
  const pathWithoutExt = basePath.replace(`.${extension}`, '');

  return `${pathWithoutExt}-${optimizedWidth}w.${format}`;
};

// Image compression utility (for client-side compression)
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Convert image to different formats
export const convertImageFormat = (
  imageUrl: string,
  format: 'webp' | 'png' | 'jpeg',
  quality: number = 0.9
): Promise<string> => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      resolve(dataUrl);
    };

    img.src = imageUrl;
  });
};

// Lazy loading intersection observer
export const createLazyLoadObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(entries => {
    forEach(entries, callback);
  }, defaultOptions);
};

// Image placeholder utilities
export const generatePlaceholder = (
  width: number,
  height: number,
  color: string = '#f0f0f0'
): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `)}`;
};

// Blur placeholder (low quality image placeholder)
export const generateBlurPlaceholder = (
  originalSrc: string,
  width: number = 40,
  height: number = 40
): Promise<string> => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      // Apply blur filter
      ctx.filter = 'blur(4px)';
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.1));
    };

    img.src = originalSrc;
  });
};

// Image error handling
export const handleImageError = (
  img: HTMLImageElement,
  fallbackSrc?: string,
  onError?: () => void
): void => {
  img.onerror = () => {
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    } else {
      onError?.();
    }
  };
};

// Get image dimensions
export const getImageDimensions = (
  src: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
};

// Image format detection
export const detectImageFormat = (file: File): string => {
  const signature = file.type;
  if (signature.includes('webp')) return 'webp';
  if (signature.includes('avif')) return 'avif';
  if (signature.includes('png')) return 'png';
  if (signature.includes('gif')) return 'gif';
  if (signature.includes('svg')) return 'svg';
  return 'jpeg';
};

// Check if browser supports image format
export const supportsImageFormat = (
  format: 'webp' | 'avif' | 'jpeg2000'
): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    const dataUrl = canvas.toDataURL(`image/${format}`);
    return dataUrl.indexOf(`data:image/${format}`) === 0;
  } catch {
    return false;
  }
};

// Image optimization recommendations
export const getImageOptimizationTips = (file: File) => {
  const tips: string[] = [];
  const sizeInMB = file.size / (1024 * 1024);

  if (sizeInMB > 2) {
    tips.push("Consider compressing the image - it's larger than 2MB");
  }

  if (file.type === 'image/png' && sizeInMB > 0.5) {
    tips.push('Consider converting PNG to WebP for better compression');
  }

  if (file.type === 'image/jpeg' && sizeInMB > 1) {
    tips.push('Consider reducing JPEG quality or dimensions');
  }

  return tips;
};
