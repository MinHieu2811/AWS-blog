# Coding Standards

## TypeScript Guidelines

### Naming Conventions
- **Variables & Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types & Interfaces**: PascalCase
- **Files**: kebab-case hoặc PascalCase cho components

```typescript
// ✅ Good
const userName = 'john';
const MAX_RETRY_COUNT = 3;
interface UserProfile { }
const UserCard = () => { };

// ❌ Bad
const user_name = 'john';
const maxRetryCount = 3;
interface userProfile { }
const userCard = () => { };
```

### Type Definitions
- Luôn define types cho props và state
- Sử dụng interfaces cho object shapes
- Sử dụng type unions cho limited values
- Export types từ file riêng

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

// ❌ Bad
const Button = (props: any) => { };
```

## React Guidelines

### Component Structure
```typescript
// ✅ Good component structure
import React from 'react';
import { ButtonProps } from '@/types';

interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  customProp,
  ...props
}) => {
  // Hooks
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    onClick?.();
    setState(!state);
  };
  
  // Render
  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
```

### Hooks Rules
- Sử dụng custom hooks cho logic phức tạp
- Đặt hooks ở đầu component
- Sử dụng useCallback và useMemo khi cần thiết

```typescript
// ✅ Good
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getData();
      setData(result);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return <div>{/* JSX */}</div>;
};
```

## CSS & Styling

### Tailwind CSS Guidelines
- Ưu tiên utility classes
- Sử dụng responsive prefixes
- Group related classes
- Sử dụng custom CSS cho complex styles

```tsx
// ✅ Good
<div className="flex flex-col sm:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
</div>

// ❌ Bad
<div className="flex flex-col sm:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-xl font-semibold text-gray-900 dark:text-white">
  <h2>Title</h2>
</div>
```

### Class Organization
```tsx
// ✅ Good - organized classes
<button
  className={cn(
    // Base styles
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2",
    // Variant styles
    variant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700",
    variant === 'secondary' && "bg-gray-600 text-white hover:bg-gray-700",
    // Size styles
    size === 'sm' && "px-3 py-1.5 text-sm",
    size === 'md' && "px-4 py-2 text-base",
    // State styles
    disabled && "opacity-50 cursor-not-allowed",
    // Custom classes
    className
  )}
>
  {children}
</button>
```

## File Organization

### Import Order
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Next.js imports
import Image from 'next/image';
import Link from 'next/link';

// 3. Third-party libraries
import { clsx } from 'clsx';

// 4. Internal imports (absolute paths)
import { Button } from '@/components/Button';
import { User } from '@/types';
import { cn } from '@/lib/utils';

// 5. Relative imports
import './styles.css';
```

### File Naming
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── UserCard.tsx
└── index.ts
```

## Error Handling

### Try-Catch Blocks
```typescript
// ✅ Good
const fetchUser = async (id: string): Promise<User | null> => {
  try {
    const response = await api.getUser(id);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

// ❌ Bad
const fetchUser = async (id: string) => {
  const response = await api.getUser(id);
  return response.data;
};
```

### Error Boundaries
```typescript
// ✅ Good
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <div>Something went wrong.</div>;
  }

  return <>{children}</>;
};
```

## Performance Guidelines

### Memoization
```typescript
// ✅ Good - use memo for expensive calculations
const ExpensiveComponent = React.memo(({ data }: { data: Data[] }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  return <div>{/* Render processedData */}</div>;
});

// ✅ Good - use callback for event handlers
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <ChildComponent onClick={handleClick} />;
};
```

## Testing Guidelines

### Component Testing
```typescript
// ✅ Good test structure
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Code Review Checklist

- [ ] Code follows TypeScript guidelines
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Performance optimizations applied
- [ ] Tests are written and passing
- [ ] Code is readable and well-documented
- [ ] No console.log statements in production code
- [ ] Imports are properly organized
- [ ] Tailwind classes are used efficiently
