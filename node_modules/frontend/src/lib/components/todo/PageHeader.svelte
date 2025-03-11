<script lang="ts">
  let { title, description } = $props<{
    title?: string;
    description?: string;
  }>();
  
  // デフォルト値を設定
  title = title || 'タスクの管理';
  description = description || 'プロジェクト管理をシンプルに。タスクを追加、編集、完了させましょう。';
</script>

<div class="grid gap-4">
  <h2 class="text-2xl font-semibold text-theme-primary transition-colors duration-200">
    {title}
  </h2>
  <p class="text-theme-muted transition-colors duration-200">
    {description}
  </p>
</div> 