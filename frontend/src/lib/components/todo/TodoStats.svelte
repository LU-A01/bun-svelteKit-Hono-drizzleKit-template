<script lang="ts">
  import type { Todo } from "@shared/models/todo";
  
  let { todos } = $props<{
    todos: Todo[];
  }>();
  
  function getActiveCount(todoList: Todo[]): number {
    return todoList.filter((t: Todo) => !t.completed).length;
  }
  
  function getTotalCount(todoList: Todo[]): number {
    return todoList.length;
  }
  
  let activeCount = $derived(getActiveCount(todos));
  let totalCount = $derived(getTotalCount(todos));
</script>

{#if totalCount > 0}
  <div class="mt-2 flex items-center gap-1 text-xs text-theme-muted transition-colors duration-200">
    <span>📊</span> {activeCount}個の未完了タスク / 合計{totalCount}個
  </div>
{/if} 