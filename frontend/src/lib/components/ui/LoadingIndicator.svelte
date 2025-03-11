<script lang="ts">
  let { message } = $props<{
    message?: string;
  }>();
  
  message = message || 'ロード中...⏳';
</script>

<div class="py-8 text-center">
  <div
    class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#0d99ff]"
  ></div>
  <p class="mt-2 text-sm text-theme-muted transition-colors duration-200">
    {message}
  </p>
</div> 