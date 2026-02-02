if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  ;(globalThis as any).self = globalThis
}

if (typeof window !== 'undefined') {
  if (!window.localStorage) {
    ;(window as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    }
  }
  if (!window.matchMedia) {
    ;(window as any).matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {}
    })
  }
}
