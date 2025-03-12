import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import Page from './+page.svelte';

// fetchのモック化
const mockTodos = [
  {
    id: '1',
    title: 'モック化されたTodo',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// グローバルfetchをモック化
vi.stubGlobal('fetch', vi.fn(() => 
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: 'http://example.com',
    json: () => Promise.resolve(mockTodos),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: () => ({} as Response),
    body: null,
    bodyUsed: false,
  } as Response)
));

describe('/+page.svelte', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // 各テスト前にfetchモックをリセットして再設定
    vi.mocked(global.fetch).mockImplementation(() => 
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
        clone: () => ({} as Response),
        body: null,
        bodyUsed: false,
      } as Response)
    );
  });

  test('should render h2', () => {
    render(Page);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
