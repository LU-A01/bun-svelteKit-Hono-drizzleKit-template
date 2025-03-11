<script lang="ts">
  let {
    darkMode,
    setLightMode,
    setDarkMode,
    resetToSystemTheme,
  } = $props<{
    darkMode: boolean;
    setLightMode: () => void;
    setDarkMode: () => void;
    resetToSystemTheme: () => void;
  }>();
</script>

<div class="fixed bottom-0 left-0 right-0 flex justify-center p-4">
  <div class="rounded-lg bg-theme-card p-3 shadow-theme transition-colors duration-200">
    <div class="flex items-center gap-4">
      <span class="text-sm font-medium">テーマ:</span>
      <button
        type="button"
        onclick={setLightMode}
        class={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
          !darkMode 
            ? 'bg-theme-accent text-white hover:bg-[var(--color-bg-accent-hover)]' 
            : 'bg-gray-200 hover:bg-[var(--color-bg-button-hover)] text-theme-secondary hover:text-theme-primary'
        }`}
      >
        ライト
      </button>
      <button
        type="button"
        onclick={setDarkMode}
        class={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
          darkMode 
            ? 'bg-theme-accent text-white hover:bg-[var(--color-bg-accent-hover)]' 
            : 'bg-gray-200 hover:bg-[var(--color-bg-button-hover)] text-theme-secondary hover:text-theme-primary'
        }`}
      >
        ダーク
      </button>
      <button
        type="button"
        onclick={resetToSystemTheme}
        class="px-3 py-1 rounded text-sm transition-colors duration-200 bg-gray-200 hover:bg-[var(--color-bg-button-hover)] text-theme-secondary hover:text-theme-primary"
      >
        システム設定
      </button>
    </div>
  </div>
</div> 