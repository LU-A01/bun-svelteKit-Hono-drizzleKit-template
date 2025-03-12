import { expect, test } from '@playwright/test';

test.describe('Todoアプリケーション', () => {
  test.beforeEach(async ({ page }) => {
    // アプリケーションのホームページに移動
    await page.goto('/');
    
    // ヘルスチェック - アプリがロードされていることを確認
    await expect(page.locator('h1').filter({ hasText: 'Todo App' })).toBeVisible();
  });
  
  test('新しいTodoを追加できる', async ({ page }) => {
    // タスク入力フィールドを見つける
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    await expect(taskInput).toBeVisible();
    
    // テスト用のランダムなタスク名を生成
    const taskName = `テストタスク ${Date.now()}`;
    
    // 新しいタスクを入力
    await taskInput.fill(taskName);
    await taskInput.press('Enter');
    
    // 追加されたタスクが表示されることを確認
    await expect(page.getByText(taskName)).toBeVisible({ timeout: 5000 });
  });
  
  test('Todoの完了状態を切り替えることができる', async ({ page }) => {
    // テスト用のタスクを追加
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const taskName = `完了切替テスト ${Date.now()}`;
    await taskInput.fill(taskName);
    await taskInput.press('Enter');
    
    // タスクが追加されたことを確認
    const todoItem = page.getByText(taskName);
    await expect(todoItem).toBeVisible();
    
    // チェックボックスを見つけてクリック
    const checkbox = page.locator(`text=${taskName}`).locator('xpath=./preceding-sibling::input[@type="checkbox"]');
    await checkbox.click();
    
    // チェックボックスがチェックされていることを確認
    await expect(checkbox).toBeChecked();
    
    // 再度クリックして未完了に戻す
    await checkbox.click();
    
    // チェックボックスがチェックされていないことを確認
    await expect(checkbox).not.toBeChecked();
  });
  
  test('Todoを削除できる', async ({ page }) => {
    // テスト用のタスクを追加
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    const taskName = `削除テスト ${Date.now()}`;
    await taskInput.fill(taskName);
    await taskInput.press('Enter');
    
    // タスクが追加されたことを確認
    const todoItem = page.getByText(taskName);
    await expect(todoItem).toBeVisible();
    
    // 削除ボタンを見つけてクリック
    const deleteButton = page.locator(`text=${taskName}`).locator('xpath=./following-sibling::button[contains(@class, "delete")]');
    await deleteButton.click();
    
    // タスクが削除されたことを確認
    await expect(todoItem).not.toBeVisible({ timeout: 5000 });
  });
  
  test('空のタスク名では追加できない', async ({ page }) => {
    // タスク数を取得
    const initialTasks = await page.locator('li').count();
    
    // 空のタスク名で試行
    const taskInput = page.getByPlaceholder('新しいタスクを入力...');
    await taskInput.fill('');
    await taskInput.press('Enter');
    
    // タスク数が変わっていないことを確認
    await expect(page.locator('li')).toHaveCount(initialTasks);
  });
}); 