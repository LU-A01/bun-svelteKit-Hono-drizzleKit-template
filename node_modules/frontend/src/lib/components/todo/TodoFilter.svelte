<script lang="ts">
  let { 
    filter,
    setFilter 
  } = $props<{
    filter: string;
    setFilter: (filter: string) => void;
  }>();
  
  function setAll() {
    setFilter("all");
  }
  
  function setActive() {
    setFilter("active");
  }
  
  function setCompleted() {
    setFilter("completed");
  }
</script>

<div class="flex items-center gap-2 border-b border-theme pb-4">
  <div class="text-sm font-medium text-theme-muted transition-colors duration-200">
    表示:
  </div>
  <div class="flex space-x-1">
    <button
      class={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        filter === "all"
          ? "bg-theme-accent text-white hover:bg-[var(--color-bg-accent-hover)]"
          : "text-theme-secondary hover:bg-[var(--color-bg-button-hover)]"
      }`}
      on:click={setAll}
    >
      <span>🔍</span> すべて
    </button>
    <button
      class={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        filter === "active"
          ? "bg-theme-accent text-white hover:bg-[var(--color-bg-accent-hover)]"
          : "text-theme-secondary hover:bg-[var(--color-bg-button-hover)]"
      }`}
      on:click={setActive}
    >
      <span>⌛</span> 未完了
    </button>
    <button
      class={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        filter === "completed"
          ? "bg-theme-accent text-white hover:bg-[var(--color-bg-accent-hover)]"
          : "text-theme-secondary hover:bg-[var(--color-bg-button-hover)]"
      }`}
      on:click={setCompleted}
    >
      <span>✓</span> 完了済み
    </button>
  </div>
</div> 