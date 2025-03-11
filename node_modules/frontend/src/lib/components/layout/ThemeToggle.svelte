<script lang="ts">
  let {
    darkMode,
    toggleDarkMode,
  } = $props<{
    darkMode: boolean;
    toggleDarkMode: () => void;
  }>();
</script>

<button 
  type="button"
  onclick={toggleDarkMode}
  class="flex h-10 w-10 items-center justify-center rounded-full text-theme-muted transition-colors hover:bg-[#e0e0e0] hover:text-theme-primary dark:hover:bg-[#3a3a3a] dark:hover:text-white"
  aria-label={darkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
>
  {#if darkMode}
    <!-- Sun icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
    </svg>
  {:else}
    <!-- Moon icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  {/if}
</button> 