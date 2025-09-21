# Component Guidelines

## Component Architecture

### Component Types

#### 1. Presentational Components
- Chỉ hiển thị UI, không có business logic
- Nhận data qua props
- Có thể tái sử dụng cao

```typescript
// ✅ Good - Presentational Component
interface CardProps {
  title: string;
  description: string;
  image?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, image, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {image && (
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
```

#### 2. Container Components
- Chứa business logic và state management
- Kết nối với data sources
- Quản lý side effects

```typescript
// ✅ Good - Container Component
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

#### 3. Layout Components
- Định nghĩa cấu trúc layout
- Có thể chứa navigation, header, footer
- Thường được sử dụng trong App Router

```typescript
// ✅ Good - Layout Component
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {title && (
          <h1 className="text-3xl font-bold mb-8">{title}</h1>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

## Component Patterns

### 1. Compound Components
```typescript
// ✅ Good - Compound Component Pattern
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-md", className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6 border-b">{children}</div>;
};

const CardBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

const CardFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6 border-t bg-gray-50">{children}</div>;
};

// Usage
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 2. Render Props Pattern
```typescript
// ✅ Good - Render Props Pattern
interface DataFetcherProps<T> {
  url: string;
  children: (data: { data: T | null; loading: boolean; error: string | null }) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return <>{children({ data, loading, error })}</>;
};

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### 3. Custom Hooks Pattern
```typescript
// ✅ Good - Custom Hook
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Usage in component
const UserList = () => {
  const { data: users, loading, error } = useApi<User[]>('/api/users');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};
```

## Component Best Practices

### 1. Props Interface
```typescript
// ✅ Good - Comprehensive props interface
interface ButtonProps {
  // Required props
  children: React.ReactNode;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  
  // Event handlers
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  
  // HTML attributes
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  id?: string;
  'data-testid'?: string;
  
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### 2. Default Props
```typescript
// ✅ Good - Default props
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) => {
  // Component implementation
};
```

### 3. Forwarding Refs
```typescript
// ✅ Good - Forward refs for DOM elements
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("base-button-styles", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 4. Error Boundaries
```typescript
// ✅ Good - Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error?.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Component Testing

### 1. Unit Testing
```typescript
// ✅ Good - Component unit test
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. Integration Testing
```typescript
// ✅ Good - Integration test
import { render, screen, waitFor } from '@testing-library/react';
import UserList from '@/components/UserList';

// Mock API
jest.mock('@/lib/api', () => ({
  getUsers: jest.fn().mockResolvedValue({
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  })
}));

describe('UserList Integration', () => {
  it('fetches and displays users', async () => {
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### 1. Memoization
```typescript
// ✅ Good - Memoized component
const ExpensiveComponent = React.memo<{ data: ComplexData[] }>(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processComplexData(item));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
});
```

### 2. Lazy Loading
```typescript
// ✅ Good - Lazy loading
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
};
```

## Accessibility Guidelines

### 1. ARIA Attributes
```typescript
// ✅ Good - Accessible component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <div
      className={cn("modal", isOpen && "modal-open")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <h2 id="modal-title" className="modal-title">
          {title}
        </h2>
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};
```

### 2. Keyboard Navigation
```typescript
// ✅ Good - Keyboard accessible
const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="menu-item"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="menuitem"
    >
      {children}
    </div>
  );
};
```
