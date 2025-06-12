interface EnvConfig {
  APP_NAME: string;
  APP_VERSION: string;
  APP_DESCRIPTION: string;
  NODE_ENV: string;
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_ANALYTICS: boolean;
  ENABLE_DEBUG: boolean;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
};

const getBooleanEnvVar = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue?: number): number => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue !== undefined) return defaultValue;
  const parsed = parseInt(value || '0', 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

export const env: EnvConfig = {
  APP_NAME: getEnvVar('VITE_APP_NAME', 'Kurama'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  APP_DESCRIPTION: getEnvVar(
    'VITE_APP_DESCRIPTION',
    'Enterprise React Application'
  ),
  NODE_ENV: getEnvVar('VITE_NODE_ENV', 'development'),
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000/api'),
  API_TIMEOUT: getNumberEnvVar('VITE_API_TIMEOUT', 10000),
  ENABLE_ANALYTICS: getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
  ENABLE_DEBUG: getBooleanEnvVar('VITE_ENABLE_DEBUG', true),
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
