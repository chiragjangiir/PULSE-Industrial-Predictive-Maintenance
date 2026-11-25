import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfills / mocks for jsdom
if (typeof window !== 'undefined') {
  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };

  const mockFetch = vi.fn().mockRejectedValue(new Error('Network error: Offline in test'));
  globalThis.fetch = mockFetch;
  window.fetch = mockFetch;
}
