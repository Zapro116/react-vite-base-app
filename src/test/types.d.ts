import 'vitest';
import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface JestAssertion<T = unknown>
      extends jest.Matchers<void, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

// Extend Vitest's expect with jest-dom matchers
interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveClass(className: string): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveTextContent(text: string | RegExp): R;
  toBeVisible(): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
  toHaveValue(value: string | number): R;
  toBeChecked(): R;
  toHaveFocus(): R;
}

declare module 'vitest' {
  interface Assertion<T = unknown> extends CustomMatchers<T> {
    not: Assertion<T>;
  }
  interface AsymmetricMatchersContaining extends CustomMatchers {
    not: AsymmetricMatchersContaining;
  }
}

// Mock types for testing
export interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface MockApiError {
  message: string;
  code: string;
  status: number;
  details: Record<string, unknown>;
}
