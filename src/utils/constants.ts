export const APP_CONFIG = {
  name: 'New Project',
  version: '1.0.0',
  description: 'A new Next.js project with TypeScript and Tailwind CSS',
  author: 'Your Name',
  url: 'https://your-domain.com',
} as const;

export const API_ENDPOINTS = {
  base: '/api',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  users: {
    list: '/users',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id',
  },
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const STORAGE_KEYS = {
  theme: 'app-theme',
  user: 'app-user',
  token: 'app-token',
  preferences: 'app-preferences',
} as const;

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  phone: /^[\+]?[1-9][\d]{0,15}$/,
} as const;

export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters long',
  confirmPassword: 'Passwords do not match',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  network: 'Network error. Please try again.',
  server: 'Server error. Please try again later.',
  unauthorized: 'You are not authorized to perform this action',
  notFound: 'The requested resource was not found',
} as const;

export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully',
  created: 'Created successfully',
  updated: 'Updated successfully',
  deleted: 'Deleted successfully',
  loggedIn: 'Logged in successfully',
  loggedOut: 'Logged out successfully',
} as const;

export enum TrackingEvent {
  PAGE_VIEW = 'page_view',
  TIME_ON_PAGE = 'time_on_page',
  SCROLL_DEPTH = 'scroll_depth',
  BLOG_COMPLETED = 'blog_completed',
  DROP_POSITION = 'drop_position',
  SESSION_END = 'session_end',
}
