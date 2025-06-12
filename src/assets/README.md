# Assets Directory

This directory contains all static assets for the application including images, icons, fonts, and other media files.

## Directory Structure

```
src/assets/
├── images/          # Application images
│   ├── hero/        # Hero/banner images
│   ├── products/    # Product images
│   ├── avatars/     # User avatars
│   └── gallery/     # Gallery images
├── icons/           # SVG icons and icon fonts
│   ├── ui/          # UI icons
│   ├── social/      # Social media icons
│   └── brands/      # Brand logos
└── fonts/           # Custom fonts
    ├── woff2/       # WOFF2 format (preferred)
    ├── woff/        # WOFF format (fallback)
    └── ttf/         # TTF format (fallback)
```

## Image Optimization Guidelines

### Recommended Formats

1. **WebP** - Modern format with excellent compression
2. **AVIF** - Next-gen format with superior compression
3. **JPEG** - For photos and complex images
4. **PNG** - For images with transparency
5. **SVG** - For icons and simple graphics

### Naming Convention

```
image-name-{width}w.{format}
```

Examples:

- `hero-banner-1920w.webp`
- `product-thumbnail-320w.jpg`
- `avatar-placeholder-40w.png`

### Size Guidelines

- **Mobile**: 320px, 640px
- **Tablet**: 768px, 1024px
- **Desktop**: 1280px, 1920px
- **Thumbnails**: 150px, 300px
- **Avatars**: 40px, 80px, 120px

### Optimization Tips

1. Use appropriate formats for content type
2. Provide multiple sizes for responsive images
3. Compress images before adding to project
4. Use lazy loading for non-critical images
5. Implement proper fallbacks

## Usage Examples

### Basic Optimized Image

```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src='/src/assets/images/hero/banner.jpg'
  alt='Hero banner'
  width={1200}
  height={600}
  lazy={true}
/>;
```

### Responsive Image

```tsx
import { ResponsiveImage } from '@/components/OptimizedImage';

<ResponsiveImage
  basePath='/src/assets/images/products/item.jpg'
  alt='Product image'
  breakpoints={{ mobile: 320, tablet: 768, desktop: 1200 }}
/>;
```

### Avatar Image

```tsx
import { AvatarImage } from '@/components/OptimizedImage';

<AvatarImage
  src='/src/assets/images/avatars/user.jpg'
  alt='User avatar'
  size={80}
  fallbackSrc='/src/assets/images/avatars/default.png'
/>;
```

### Hero Image (Priority Loading)

```tsx
import { HeroImage } from '@/components/OptimizedImage';

<HeroImage
  src='/src/assets/images/hero/main-banner.jpg'
  alt='Main hero banner'
  width={1920}
  height={800}
/>;
```

## Build Optimizations

The Vite configuration includes:

- Automatic asset optimization
- Code splitting for images
- Proper caching headers
- Asset organization by type
- Inline small assets as base64

## Performance Best Practices

1. **Lazy Loading**: Use lazy loading for images below the fold
2. **Priority Loading**: Use priority loading for above-the-fold images
3. **Responsive Images**: Provide multiple sizes using srcSet
4. **Format Selection**: Use modern formats with fallbacks
5. **Compression**: Optimize images before deployment
6. **Caching**: Leverage browser caching with proper headers

## Tools and Utilities

The project includes utility functions in `@/utils/imageUtils.ts`:

- Image loading and preloading
- Format conversion
- Compression utilities
- Lazy loading observers
- Placeholder generation
- Error handling

## Integration with Components

All image components are located in `@/components/OptimizedImage.tsx`:

- `OptimizedImage` - Base optimized image component
- `ResponsiveImage` - Responsive image with breakpoints
- `HeroImage` - Priority loading for hero images
- `AvatarImage` - Circular avatar images
