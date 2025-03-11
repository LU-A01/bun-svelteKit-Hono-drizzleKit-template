<script lang="ts">
  let { message } = $props<{
    message: string;
  }>();
</script>

{#if message}
  <div
    class="flex items-center gap-2 rounded-md bg-[#ffe0eb] p-3 text-sm text-[#ff4081] dark:bg-[#ff4081]/10 dark:text-[#ff80ab]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {message}
  </div>
{/if} 