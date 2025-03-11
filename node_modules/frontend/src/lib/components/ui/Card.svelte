<script lang="ts">
  let { class: className, children, ...props } = $props();
</script>

<div
  class={`rounded-lg border bg-theme-card shadow-theme transition-colors duration-200 p-6 border-theme ${className}`}
  {...props}
>
  {@render children?.()}
</div> 