// Svelte 5 テスト環境のセットアップ
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/svelte';
import { afterEach, vi } from 'vitest';

// テスト間でDOMをクリーンアップ
afterEach(() => {
  cleanup();
});

// jsdomがmatchMediaをサポートしていないため、モックを設定
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// タイマーのモック化
vi.useFakeTimers();

// APIリクエストのモック化
const mockTodos = [
  {
    id: '1',
    title: 'モック化されたTodo',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// グローバルfetchのモック化
vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      headers: new Headers(),
      redirected: false,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: 'http://example.com',
      json: () => Promise.resolve(mockTodos),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      formData: () => Promise.resolve(new FormData()),
      clone: () => ({}) as Response,
      body: null,
      bodyUsed: false,
    } as Response)
  )
);

// コンソールエラーの監視
const originalConsoleError = console.error;
console.error = (...args) => {
  // テスト中のエラーをキャプチャして表示
  originalConsoleError(...args);
};
