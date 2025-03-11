<script lang="ts">
  let { filter } = $props<{
    filter: string;
  }>();
  
  // フィルターに応じたメッセージとアイコンを決定
  function getIcon(currentFilter: string): string {
    if (currentFilter === "all") return "📝";
    if (currentFilter === "active") return "⌛";
    return "✓";
  }
  
  function getMessage(currentFilter: string): string {
    if (currentFilter === "all") return "タスクがありません。新しいタスクを追加してください。";
    if (currentFilter === "active") return "未完了のタスクはありません。";
    return "完了済みのタスクはありません。";
  }
  
  let icon = $derived(getIcon(filter));
  let message = $derived(getMessage(filter));
</script>

<div class="py-8 text-center text-theme-muted transition-colors duration-200">
  <div class="mb-3 text-2xl">
    {icon}
  </div>
  {message}
</div> 