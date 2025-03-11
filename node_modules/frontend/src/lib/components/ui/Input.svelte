<script lang="ts">
  let {
    class: className = "",
    value = $bindable(""),
    id = "",
    ...props
  } = $props<{
    class?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    id?: string;
  }>();
</script>

<input
  {id}
  class={`flex h-10 w-full rounded-lg border border-theme bg-theme-card px-4 py-2 text-sm text-theme-primary
  shadow-sm transition-all
  hover:border-theme-hover
  file:border-0 file:bg-transparent file:text-sm file:font-medium 
  placeholder:text-theme-muted 
  focus-visible:outline-none focus-visible:border-[#0d99ff] focus-visible:ring-2 focus-visible:ring-[#0d99ff]/20 
  disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  bind:value
  {...props}
/>
