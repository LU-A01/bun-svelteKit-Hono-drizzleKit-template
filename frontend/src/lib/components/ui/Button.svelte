<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  type Variant = "default" | "outline" | "ghost" | "danger";
  type Size = "default" | "sm" | "lg" | "icon";

  let {
    variant = "default",
    size = "default",
    class: className = "",
    type = "button",
    icon = "",
    children,
    onClick,
    ...props
  } = $props<{
    variant?: Variant;
    size?: Size;
    class?: string;
    type?: "button" | "submit" | "reset";
    icon?: string;
    children?: any;
    onClick?: () => void;
  }>();

  const dispatch = createEventDispatcher();
  
  function handleClick() {
    if (onClick) onClick();
  }

  // Variants
  const variants: Record<Variant, string> = {
    default:
      "bg-gradient-to-r from-[#0d99ff] to-[#0d83ff] text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all dark:from-[#0d99ff] dark:to-[#0d83ff] dark:text-white dark:shadow-[0_4px_14px_0_rgba(13,153,255,0.2)]",
    outline:
      "border border-theme bg-theme-card text-theme-primary shadow-sm hover:bg-theme-hover hover:shadow-md transition-all",
    ghost: "bg-transparent text-theme-primary hover:bg-theme-hover transition-all",
    danger:
      "bg-gradient-to-r from-[#ff80ab] to-[#ff4081] text-white shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all dark:shadow-[0_4px_14px_0_rgba(255,128,171,0.25)]",
  };

  // Sizes
  const sizes: Record<Size, string> = {
    default: "h-10 px-5 py-2 text-sm font-medium",
    sm: "h-8 px-4 py-1 text-xs font-medium",
    lg: "h-12 px-6 py-3 text-base font-medium",
    icon: "h-10 w-10 p-2",
  };
</script>

<button
  {type}
  class={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d99ff] focus-visible:ring-offset-2 
  disabled:pointer-events-none disabled:opacity-50 
  ${variants[variant as Variant]} ${sizes[size as Size]} ${className}`}
  onclick={handleClick}
  {...props}
>
  {#if icon}
    <span class="inline-flex items-center">{@html icon}</span>
  {/if}
  {@render children?.()}
</button>
