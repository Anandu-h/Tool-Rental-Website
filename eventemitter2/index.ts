// Minimal EventEmitter2 shim for wagmi/WalletConnect compatibility
export class EventEmitter2 {
  private events: Map<string, Function[]> = new Map()

  on(event: string, listener: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
    return this
  }

  off(event: string, listener: Function): this {
    const listeners = this.events.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
    return this
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(...args))
      return true
    }
    return false
  }

  once(event: string, listener: Function): this {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper)
      listener(...args)
    }
    return this.on(event, onceWrapper)
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
    return this
  }

  addListener = this.on
  removeListener = this.off
}

// Export both named and default for maximum compatibility
export default EventEmitter2
