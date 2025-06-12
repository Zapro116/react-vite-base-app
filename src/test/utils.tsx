/* eslint-disable react-refresh/only-export-components */
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { HelmetProvider } from 'react-helmet-async';
import { vi } from 'vitest';

// Test theme (simplified version of the main theme)
const testTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
  defaultRadius: 'md',
});

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  withRouter?: boolean;
  withMantine?: boolean;
  withModals?: boolean;
  withNotifications?: boolean;
  withHelmet?: boolean;
}

function AllTheProviders({
  children,
  withRouter = true,
  withMantine = true,
  withModals = true,
  withNotifications = true,
  withHelmet = true,
}: {
  children: React.ReactNode;
} & Omit<CustomRenderOptions, 'initialEntries'>) {
  let component = <>{children}</>;

  if (withHelmet) {
    component = <HelmetProvider>{component}</HelmetProvider>;
  }

  if (withMantine) {
    component = (
      <MantineProvider theme={testTheme} defaultColorScheme='light'>
        {component}
      </MantineProvider>
    );
  }

  if (withModals) {
    component = <ModalsProvider>{component}</ModalsProvider>;
  }

  if (withRouter) {
    component = <BrowserRouter>{component}</BrowserRouter>;
  }

  if (withNotifications) {
    component = (
      <>
        <Notifications position='top-right' />
        {component}
      </>
    );
  }

  return component;
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    withRouter,
    withMantine,
    withModals,
    withNotifications,
    withHelmet,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders
      withRouter={withRouter}
      withMantine={withMantine}
      withModals={withModals}
      withNotifications={withNotifications}
      withHelmet={withHelmet}
    >
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponse = <T,>(data: T) => ({
  data,
  message: 'Success',
  success: true,
  timestamp: new Date().toISOString(),
});

export const mockApiError = (
  message: string,
  code = 'ERROR',
  status = 400
) => ({
  message,
  code,
  status,
  details: {},
});

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  role: 'user' as const,
  isActive: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

// Wait for async operations
export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Create mock functions with proper typing
export const createMockFn = <T extends (...args: unknown[]) => unknown>(
  implementation?: T
) => {
  const mockFn = vi.fn(implementation);
  return mockFn as T & ReturnType<typeof vi.fn>;
};

// Mock fetch response
export const mockFetchResponse = (data: unknown, ok = true, status = 200) => {
  const mockResponse = {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    blob: vi.fn().mockResolvedValue(new Blob()),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    headers: new Headers(),
    redirected: false,
    statusText: ok ? 'OK' : 'Error',
    type: 'basic' as ResponseType,
    url: 'http://localhost:3000',
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
  };

  return mockResponse;
};

// Custom matchers for better assertions
export const customMatchers = {
  toBeInTheDocument: (received: unknown) => {
    const pass = received !== null && received !== undefined;
    return {
      message: () =>
        pass
          ? `Expected element not to be in the document`
          : `Expected element to be in the document`,
      pass,
    };
  },
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi } from 'vitest';
