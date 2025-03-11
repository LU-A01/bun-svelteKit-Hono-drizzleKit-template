<script lang="ts">
  import Button from "./ui/Button.svelte";
  import Input from "./ui/Input.svelte";
  import type { CreateTodoDto } from "@shared/dto/todo";
  import { CreateTodoSchema } from "@shared/validation/todo";

  let { onCreate } = $props<{
    onCreate?: (todo: CreateTodoDto) => void;
  }>();

  let title = $state("");
  let error = $state("");

  function handleSubmit() {
    try {
      // バリデーション実行
      const result = CreateTodoSchema.parse({ title, completed: false });

      // 親コンポーネントの関数を呼び出し
      onCreate?.(result);

      // フォームをリセット
      title = "";
      error = "";
    } catch (e) {
      // バリデーションエラーを表示
      error = "タイトルは1文字以上入力してください";
    }
  }

  // 追加ボタン用のプラスアイコン
  const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>`;
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="grid gap-4">
  <div class="grid gap-2">
    <label for="title" class="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      新しいタスク ✨
    </label>
    <div class="flex gap-2">
      <Input
        id="title"
        bind:value={title}
        placeholder="タスクを入力..."
        class={error ? "border-[#ff4081] dark:border-[#ff80ab]" : ""}
      />
      <Button type="submit" icon={plusIcon} />
    </div>
  </div>

  {#if error}
    <p class="flex items-center gap-1.5 text-sm text-[#ff4081] dark:text-[#ff80ab]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {error}
    </p>
  {/if}
</form>
