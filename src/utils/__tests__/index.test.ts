import { describe, it, expect } from 'vitest';
import {
  capitalize,
  truncate,
  slugify,
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  isToday,
  groupBy,
  sortBy,
  isEmpty,
  isEmail,
  isPhoneNumber,
  delay,
  debounce,
  throttle,
  getErrorMessage,
} from '@/utils';

describe('String utilities', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
    expect(capitalize('')).toBe('');
  });

  it('should truncate text correctly', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('Hi', 10)).toBe('Hi');
    expect(truncate('Hello World', 11)).toBe('Hello World');
  });

  it('should create slugs from text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
  });
});

describe('Number utilities', () => {
  it('should format currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    // The exact format may vary by system locale, so just check it contains the expected parts
    const euroFormatted = formatCurrency(1000, 'EUR', 'de-DE');
    expect(euroFormatted).toContain('1.000');
    expect(euroFormatted).toContain('€');
  });

  it('should format numbers', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });
});

describe('Date utilities', () => {
  it('should format dates', () => {
    const date = new Date('2023-12-25');
    const formatted = formatDate(date);
    expect(formatted).toContain('December');
    expect(formatted).toContain('25');
    expect(formatted).toContain('2023');
  });

  it('should check if date is today', () => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    expect(isToday(today)).toBe(true);
    expect(isToday(yesterday)).toBe(false);
  });

  it('should format relative time', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');
  });
});

describe('Array utilities', () => {
  const testData = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'New York' },
    { name: 'Bob', age: 35, city: 'London' },
  ];

  it('should group by key', () => {
    const grouped = groupBy(testData, 'city');
    expect(grouped['New York']).toHaveLength(2);
    expect(grouped['London']).toHaveLength(1);
  });

  it('should sort by key', () => {
    const sorted = sortBy(testData, 'age');
    expect(sorted[0].age).toBe(25);
    expect(sorted[2].age).toBe(35);

    const sortedDesc = sortBy(testData, 'age', 'desc');
    expect(sortedDesc[0].age).toBe(35);
    expect(sortedDesc[2].age).toBe(25);
  });
});

describe('Validation utilities', () => {
  it('should check if value is empty', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('  ')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);

    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  it('should validate email addresses', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('user.name+tag@domain.co.uk')).toBe(true);

    expect(isEmail('invalid-email')).toBe(false);
    expect(isEmail('test@')).toBe(false);
    expect(isEmail('@example.com')).toBe(false);
  });

  it('should validate phone numbers', () => {
    expect(isPhoneNumber('+1234567890')).toBe(true);
    expect(isPhoneNumber('(123) 456-7890')).toBe(true);
    expect(isPhoneNumber('123-456-7890')).toBe(true);

    expect(isPhoneNumber('123')).toBe(false);
    expect(isPhoneNumber('abc-def-ghij')).toBe(false);
  });
});

describe('Async utilities', () => {
  it('should delay execution', async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(90);
  });

  it('should debounce function calls', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 50);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0);

    await delay(60);
    expect(callCount).toBe(1);
  });

  it('should throttle function calls', async () => {
    let callCount = 0;
    const throttledFn = throttle(() => callCount++, 50);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(callCount).toBe(1);

    await delay(60);
    throttledFn();
    expect(callCount).toBe(2);
  });
});

describe('Error utilities', () => {
  it('should extract error messages', () => {
    expect(getErrorMessage(new Error('Test error'))).toBe('Test error');
    expect(getErrorMessage('String error')).toBe('String error');
    expect(getErrorMessage({ unknown: 'object' })).toBe(
      'An unknown error occurred'
    );
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
  });
});
