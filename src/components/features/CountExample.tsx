'use client';

import { useState } from 'react';
import Button from '../Button';

export function CountExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="my-4 p-4 border rounded-lg">
      <p className="mb-2">This is an interactive component inside MDX.</p>
      <p className="mb-4">Current count: <strong>{count}</strong></p>
      <div className="flex gap-2">
        <Button onClick={() => setCount(count + 1)}>
          Increment
        </Button>
        <Button onClick={() => setCount(count - 1)}>
          Decrement
        </Button>
      </div>
    </div>
  );
}
