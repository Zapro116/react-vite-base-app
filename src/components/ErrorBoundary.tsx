import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Title, Text, Button, Stack, Alert } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { env } from '@/config/env';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (env.ENABLE_DEBUG) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container size='sm' py='xl'>
          <Stack align='center' gap='lg'>
            <IconAlertTriangle size={64} color='red' />

            <Stack align='center' gap='sm'>
              <Title order={2} ta='center'>
                Oops! Something went wrong
              </Title>
              <Text c='dimmed' ta='center' size='lg'>
                We're sorry, but something unexpected happened. Please try
                refreshing the page.
              </Text>
            </Stack>

            {env.ENABLE_DEBUG && this.state.error && (
              <Alert
                variant='light'
                color='red'
                title='Error Details (Development Mode)'
                icon={<IconAlertTriangle size={16} />}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Stack gap='xs'>
                  <Text size='sm' fw={500}>
                    {this.state.error.name}: {this.state.error.message}
                  </Text>
                  {this.state.error.stack && (
                    <Text
                      size='xs'
                      c='dimmed'
                      style={{ fontFamily: 'monospace' }}
                    >
                      {this.state.error.stack}
                    </Text>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <Text
                      size='xs'
                      c='dimmed'
                      style={{ fontFamily: 'monospace' }}
                    >
                      Component Stack: {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </Stack>
              </Alert>
            )}

            <Stack gap='sm'>
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={this.handleReload}
                size='lg'
              >
                Reload Page
              </Button>
              <Button variant='light' onClick={this.handleReset} size='md'>
                Try Again
              </Button>
            </Stack>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    if (env.ENABLE_DEBUG) {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
    }

    // In a real app, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
