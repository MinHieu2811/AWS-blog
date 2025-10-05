import { useSyncExternalStore } from 'react'

type Listener = () => void

class ExternalStore<T> {
  private value: T
  private listeners: Set<Listener> = new Set()

  constructor(initialValue: T) {
    this.value = initialValue
  }

  getValue(): T {
    return this.value
  }

  setValue(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue
      this.listeners.forEach((listener) => listener())
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }
}

export function useExternalStore<T>(store: ExternalStore<T>): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getValue.bind(store),
    store.getValue.bind(store)
  )

  const setValue = (newValue: T) => {
    store.setValue(newValue)
  }

  return [value, setValue]
}

export { ExternalStore }
