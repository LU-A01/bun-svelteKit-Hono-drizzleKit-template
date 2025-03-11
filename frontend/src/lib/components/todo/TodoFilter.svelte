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
          ? "bg-[#0d99ff] text-white hover:bg-[#0a85e0] dark:hover:bg-[#1ea5ff]"
          : "text-theme-secondary hover:bg-[#e0e0e0] dark:hover:bg-[#3a3a3a]"
      }`}
      on:click={setAll}
    >
      <span>🔍</span> すべて
    </button>
    <button
      class={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        filter === "active"
          ? "bg-[#0d99ff] text-white hover:bg-[#0a85e0] dark:hover:bg-[#1ea5ff]"
          : "text-theme-secondary hover:bg-[#e0e0e0] dark:hover:bg-[#3a3a3a]"
      }`}
      on:click={setActive}
    >
      <span>⌛</span> 未完了
    </button>
    <button
      class={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        filter === "completed"
          ? "bg-[#0d99ff] text-white hover:bg-[#0a85e0] dark:hover:bg-[#1ea5ff]"
          : "text-theme-secondary hover:bg-[#e0e0e0] dark:hover:bg-[#3a3a3a]"
      }`}
      on:click={setCompleted}
    >
      <span>✓</span> 完了済み
    </button>
  </div>
</div> 