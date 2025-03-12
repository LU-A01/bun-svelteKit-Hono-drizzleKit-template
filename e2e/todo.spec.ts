import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    // アプリケーションのホームページに移動
    await page.goto('/');
  });

  test('should display the title', async ({ page }) => {
    // タイトルが表示されていることを確認
    await expect(page.locator('h2')).toContainText('タスクの管理');
  });

  test('should add a new todo', async ({ page }) => {
    // 新しいTodoを追加
    const todoInput = page.locator('input[placeholder="新しいタスクを入力..."]');
    await todoInput.fill('E2Eテスト用のタスク');
    await todoInput.press('Enter');

    // 追加されたTodoが表示されていることを確認
    await expect(page.locator('text=E2Eテスト用のタスク')).toBeVisible();
  });

  test('should toggle todo completion status', async ({ page }) => {
    // 新しいTodoを追加
    const todoInput = page.locator('input[placeholder="新しいタスクを入力..."]');
    await todoInput.fill('トグルテスト用のタスク');
    await todoInput.press('Enter');

    // Todoのチェックボックスをクリック
    const todoItem = page.locator('text=トグルテスト用のタスク').first();
    const checkbox = todoItem.locator('xpath=../..').locator('[role="checkbox"]');
    await checkbox.click();

    // 完了状態になっていることを確認（line-throughクラスが適用されている）
    await expect(todoItem.locator('xpath=..')).toHaveClass(/line-through/);
  });

  test('should filter todos', async ({ page }) => {
    // 新しいTodoを追加
    const todoInput = page.locator('input[placeholder="新しいタスクを入力..."]');
    await todoInput.fill('フィルターテスト用のタスク');
    await todoInput.press('Enter');

    // 「完了」フィルターをクリック
    await page.locator('text=完了').click();

    // 未完了のTodoが表示されていないことを確認
    await expect(page.locator('text=フィルターテスト用のタスク')).not.toBeVisible();

    // 「すべて」フィルターをクリック
    await page.locator('text=すべて').click();

    // 再びTodoが表示されていることを確認
    await expect(page.locator('text=フィルターテスト用のタスク')).toBeVisible();
  });
}); 