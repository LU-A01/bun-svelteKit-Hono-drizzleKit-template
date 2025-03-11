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
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
        }`}
      >
        ライト
      </button>
      <button
        type="button"
        onclick={setDarkMode}
        class={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
          darkMode 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
        }`}
      >
        ダーク
      </button>
      <button
        type="button"
        onclick={resetToSystemTheme}
        class="px-3 py-1 rounded text-sm transition-colors duration-200 bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        システム設定
      </button>
    </div>
  </div>
</div> 