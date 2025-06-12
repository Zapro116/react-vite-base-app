# Kurama - Enterprise React Application

A modern, production-ready React application built with TypeScript, Vite, Mantine UI, and TailwindCSS. This project follows enterprise-grade best practices and includes comprehensive tooling for scalable development.

## 🚀 Features

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety with strict configuration
- **Vite** - Lightning-fast development and build tool
- **Mantine UI** - Beautiful and accessible component library
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Helmet** - SEO management
- **ESLint + Prettier** - Code linting and formatting
- **Husky** - Git hooks for code quality
- **Absolute Imports** - Clean import paths with TypeScript path mapping
- **Error Boundaries** - Comprehensive error handling
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Built-in theme switching
- **Enterprise Architecture** - Scalable folder structure

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── constants/          # Application constants
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── lib/                # Third-party library configurations
├── middlewares/        # Middleware functions (optional)
├── pages/              # Page components
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── index.css          # Global styles and Tailwind imports
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Routing library

### UI & Styling

- **Mantine** - Component library
- **TailwindCSS** - Utility-first CSS
- **Tabler Icons** - Icon library
- **Custom animations** - CSS animations and transitions

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

### SEO & Meta

- **React Helmet Async** - Document head management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd kurama
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build directory

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Application Configuration
VITE_APP_NAME=Kurama
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Enterprise React Application

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Absolute Imports

The project is configured with absolute imports using TypeScript path mapping:

```typescript
import { Button } from '@/components/Button';
import { apiClient } from '@/services/api';
import { ROUTES } from '@/constants';
```

### Mantine Theme

Customize the Mantine theme in `src/App.tsx`:

```typescript
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, sans-serif',
  // Add your custom theme configuration
});
```

### TailwindCSS

Extend TailwindCSS configuration in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom colors
        },
      },
    },
  },
};
```

## 🏗️ Architecture

### Component Structure

```typescript
// Example component structure
interface ComponentProps {
  // Props interface
}

export function Component({ ...props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### API Services

The project includes a robust API service layer:

```typescript
import { apiClient } from '@/services/api';

// GET request
const data = await apiClient.get('/users');

// POST request
const user = await apiClient.post('/users', userData);
```

### Custom Hooks

Use the provided API hooks for data fetching:

```typescript
import { useGet, usePost } from '@/hooks/useApi';

function UserList() {
  const { data, isLoading, error } = useGet('/users');
  const { post, isLoading: isCreating } = usePost('/users');

  // Component logic
}
```

### Error Handling

Global error boundary catches and handles errors:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<CustomErrorUI />}>
  <App />
</ErrorBoundary>
```

## 🎨 Styling

### TailwindCSS Classes

Use Tailwind utility classes for styling:

```jsx
<div className='flex min-h-screen items-center justify-center bg-gray-100'>
  <Card className='p-6 shadow-lg'>
    <Title className='mb-4 text-center text-2xl font-bold'>Welcome</Title>
  </Card>
</div>
```

### Custom Animations

Pre-built animation classes are available:

```jsx
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-up">Slide up animation</div>
```

### Responsive Design

Mobile-first responsive design:

```jsx
<Grid>
  <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>Content</Grid.Col>
</Grid>
```

## 🧪 Testing

Comprehensive testing setup with **Vitest** for unit testing and **Playwright** for end-to-end testing.

### Unit Testing (Vitest)

- **Framework**: Vitest with React Testing Library
- **Setup**: Configured with jsdom environment and custom test utilities
- **Coverage**: Built-in coverage reporting
- **Mocking**: Vi mocking utilities for API calls and browser APIs

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### End-to-End Testing (Playwright)

- **Framework**: Playwright with multi-browser support
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Mobile viewport testing (Chrome, Safari)
- **Features**: Screenshots, videos, traces on failure

```bash
# Run e2e tests
npm run e2e

# Run e2e tests with UI
npm run e2e:ui

# Run e2e tests in headed mode
npm run e2e:headed

# Debug e2e tests
npm run e2e:debug
```

### Test Structure

```
src/
├── test/                    # Test utilities and setup
│   ├── setup.ts            # Global test configuration
│   ├── utils.tsx           # Custom render functions with providers
│   └── types.d.ts          # Test type declarations
├── **/__tests__/           # Unit tests co-located with source
└── e2e/                    # End-to-end tests
    ├── homepage.spec.ts    # Homepage e2e tests
    └── 404.spec.ts         # 404 page e2e tests
```

### CI/CD Integration

- **GitHub Actions**: Automated testing on push/PR
- **Multi-Node**: Tests run on Node 18.x and 20.x
- **Parallel Jobs**: Unit tests, e2e tests, and coverage run in parallel
- **Artifacts**: Test reports and coverage uploaded automatically

## 📦 Building for Production

1. Build the application:

```bash
npm run build
```

2. Preview the build:

```bash
npm run preview
```

The built files will be in the `dist` directory.

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow the existing code style
- Run `npm run lint` and `npm run format` before committing
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Mantine](https://mantine.dev/) - Component library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search [existing issues](issues/)
3. Create a [new issue](issues/new)

---

**Happy coding! 🎉**
