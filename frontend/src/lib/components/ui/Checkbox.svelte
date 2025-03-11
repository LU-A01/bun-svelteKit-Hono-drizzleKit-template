<script lang="ts">
  let { 
    checked = false, 
    class: className = ''
  } = $props<{
    checked?: boolean;
    class?: string;
  }>();
</script>

<button
  type="button"
  role="checkbox"
  aria-checked={checked}
  class={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-theme 
  transition-all duration-200 ease-in-out
  ${checked ? 'border-transparent bg-[#0d99ff] shadow-[0_0_0_1px_rgba(13,153,255,0.4)]' : 'bg-theme-card hover:border-theme-hover'}
  ring-offset-white 
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d99ff] focus-visible:ring-offset-2 
  disabled:cursor-not-allowed disabled:opacity-50 
  data-[state=checked]:text-white 
  dark:ring-offset-[#1e1e1e] ${checked ? 'dark:bg-[#0d99ff]' : ''} ${className}`}
  data-state={checked ? 'checked' : 'unchecked'}
>
  {#if checked}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="h-3.5 w-3.5 transition-transform duration-200 ease-out">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  {/if}
</button> 