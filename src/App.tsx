import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppLayout } from '@/layouts/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/constants';

// Create custom Mantine theme
const theme = createTheme({
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  primaryColor: 'blue',
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  respectReducedMotion: true,
  colors: {
    // Custom color palette can be added here
    brand: [
      '#e3f2fd',
      '#bbdefb',
      '#90caf9',
      '#64b5f6',
      '#42a5f5',
      '#2196f3',
      '#1e88e5',
      '#1976d2',
      '#1565c0',
      '#0d47a1',
    ],
  },
  breakpoints: {
    xs: '30em',
    sm: '48em',
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  spacing: {
    xs: '0.625rem',
    sm: '0.875rem',
    md: '1.125rem',
    lg: '1.375rem',
    xl: '1.875rem',
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
});

function App() {
  return (
    <HelmetProvider>
      <MantineProvider theme={theme} defaultColorScheme='auto'>
        <ModalsProvider>
          <Notifications position='top-right' zIndex={1000} />
          <ErrorBoundary>
            <Router>
              <Routes>
                {/* Routes with layout */}
                <Route
                  path={ROUTES.HOME}
                  element={
                    <AppLayout>
                      <HomePage />
                    </AppLayout>
                  }
                />

                {/* Placeholder routes - you can add more pages here */}
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <AppLayout>
                      <div className='p-8'>
                        <h1 className='mb-4 text-2xl font-bold'>
                          Profile Page
                        </h1>
                        <p className='text-gray-600'>
                          This is a placeholder for the profile page.
                        </p>
                      </div>
                    </AppLayout>
                  }
                />

                <Route
                  path={ROUTES.SETTINGS}
                  element={
                    <AppLayout>
                      <div className='p-8'>
                        <h1 className='mb-4 text-2xl font-bold'>
                          Settings Page
                        </h1>
                        <p className='text-gray-600'>
                          This is a placeholder for the settings page.
                        </p>
                      </div>
                    </AppLayout>
                  }
                />

                {/* 404 route - no layout */}
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </ModalsProvider>
      </MantineProvider>
    </HelmetProvider>
  );
}

export default App;
