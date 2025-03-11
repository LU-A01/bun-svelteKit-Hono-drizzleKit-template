<script lang="ts">
  import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
  
  let { 
    darkMode,
    toggleDarkMode 
  } = $props<{
    darkMode: boolean;
    toggleDarkMode: () => void;
  }>();
</script>

<header class="border-b border-theme bg-theme-header px-6 py-4 shadow-theme transition-colors duration-200">
  <div class="mx-auto flex max-w-5xl items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-[#0d99ff] text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>
      <h1 class="text-xl font-semibold text-theme-primary transition-colors duration-200">
        Task<span class="text-[#0d99ff]">Flow</span>
      </h1>
    </div>
    
    <ThemeToggle {darkMode} {toggleDarkMode} />
  </div>
</header> 