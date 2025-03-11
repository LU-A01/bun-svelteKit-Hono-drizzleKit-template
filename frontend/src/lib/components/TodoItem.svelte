<script lang="ts">
  import type { Todo } from "@shared/models/todo";
  import Checkbox from "./ui/Checkbox.svelte";

  // Todoアイテムのプロパティを受け取る
  let { 
    todo,
    onToggle,
    onDelete
  } = $props<{ 
    todo: Todo;
    onToggle?: (id: string, completed: boolean) => void;
    onDelete?: (id: string) => void;
  }>();

  // チェックボックスの状態
  let checked = $state(todo.completed);

  // チェックボックスが変更されたときのハンドラー
  function handleToggle() {
    checked = !checked;
    onToggle?.(todo.id, checked);
  }

  // 削除ボタンがクリックされたときのハンドラー
  function handleDelete() {
    onDelete?.(todo.id);
  }

  // 削除ボタン用のアイコン
  const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#ff80ab] hover:text-[#ff4081] dark:text-[#ff80ab] dark:hover:text-[#ff4081]">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>`;
</script>

<div class="group flex items-center justify-between rounded-md border border-theme bg-theme-card px-4 py-3 transition-all hover:border-gray-300 dark:hover:border-gray-700">
  <div class="flex items-center gap-3">
    <!-- カスタムチェックボックススタイル -->
    <div 
      role="checkbox"
      aria-checked={checked}
      on:click={handleToggle}
      class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border cursor-pointer
      transition-all duration-200 ease-in-out
      ${checked ? 'border-transparent bg-[#0d99ff] shadow-[0_0_0_1px_rgba(13,153,255,0.4)]' : 'border-theme bg-theme-card hover:border-theme-hover'}
      `}
    >
      {#if checked}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="h-3.5 w-3.5 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      {/if}
    </div>
    
    <div class="cursor-pointer" on:click={handleToggle}>
      <span class={`flex items-center gap-1.5 text-sm font-medium transition-all ${checked ? 'text-theme-muted line-through' : 'text-theme-secondary'}`}>
        {todo.title}
        {#if checked}
          <span class="inline-flex items-center text-[#0d99ff]">✓</span>
        {:else}
          <span class="inline-flex items-center text-theme-muted">⌛</span>
        {/if}
      </span>
    </div>
  </div>
  
  <button
    class="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center h-10 w-10 p-2 rounded-lg bg-transparent text-theme-primary hover:bg-[#fff0f3] hover:text-[#ff4081] dark:hover:bg-[#3a2a30] dark:hover:text-[#ff80ab] transition-all duration-200"
    on:click={handleDelete}
  >
    {@html deleteIcon}
  </button>
</div> 