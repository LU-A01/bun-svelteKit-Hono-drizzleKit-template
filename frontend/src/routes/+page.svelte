<script lang="ts">
  import { onMount } from "svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import TodoItem from "$lib/components/TodoItem.svelte";
  import TodoForm from "$lib/components/TodoForm.svelte";
  import PageHeader from "$lib/components/todo/PageHeader.svelte";
  import TodoFilter from "$lib/components/todo/TodoFilter.svelte";
  import ErrorAlert from "$lib/components/ui/ErrorAlert.svelte";
  import LoadingIndicator from "$lib/components/ui/LoadingIndicator.svelte";
  import EmptyState from "$lib/components/todo/EmptyState.svelte";
  import TodoStats from "$lib/components/todo/TodoStats.svelte";
  import type { Todo } from "@shared/models/todo";
  import type { CreateTodoDto, UpdateTodoDto } from "@shared/dto/todo";
  import { API_ENDPOINTS } from "@shared/constants/api";

  // 状態をrunesモードで明示的に宣言
  let todos = $state<Todo[]>([]);
  let loading = $state(true);
  let error = $state("");
  let filter = $state("all"); // 'all', 'active', 'completed'

  // フィルター適用後のTodos
  function getFilteredTodos(todoList: Todo[], currentFilter: string): Todo[] {
    if (currentFilter === "all") return todoList;
    if (currentFilter === "active") return todoList.filter((todo) => !todo.completed);
    return todoList.filter((todo) => todo.completed);
  }
  
  let filteredTodos = $derived(getFilteredTodos(todos, filter));

  // マウント時にTodosを取得
  onMount(async () => {
    try {
      console.log('Todosの取得を開始します...');
      await fetchTodos();
      console.log('Todosの取得が完了しました。件数:', todos.length);
    } catch (e) {
      console.error('Todosの取得中にエラーが発生しました:', e);
      if (e instanceof Error) {
        error = `読み込み中にエラーが発生しました: ${e.message}`;
      } else {
        error = "読み込み中にエラーが発生しました。";
      }
    } finally {
      console.log('loading状態を変更します:', false);
      loading = false;
    }
  });

  // Todosの取得
  async function fetchTodos() {
    console.log('API呼び出し:', API_ENDPOINTS.TODOS);
    try {
      const response = await fetch(API_ENDPOINTS.TODOS, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('APIレスポンス:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('APIエラー:', errorText);
        throw new Error(`Todosの取得に失敗しました (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('取得したデータ:', data);
      todos = data;
    } catch (e) {
      console.error('fetchTodos内のエラー:', e);
      throw e;
    }
  }

  // Todoの作成
  async function handleCreate(data: CreateTodoDto) {
    try {
      const response = await fetch(API_ENDPOINTS.TODOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Todoの作成に失敗しました");

      const newTodo = await response.json();
      todos = [...todos, newTodo];
    } catch (e) {
      error = "Todoの追加に失敗しました。";
    }
  }

  // Todoの完了状態の切り替え
  async function handleToggle(id: string, completed: boolean) {
    try {
      const todoToUpdate = todos.find((t) => t.id === id);
      if (!todoToUpdate) return;

      const response = await fetch(API_ENDPOINTS.TODO(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error("Todoの更新に失敗しました");

      // 成功したら状態を更新
      todos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      );
    } catch (e) {
      error = "Todoの更新に失敗しました。";
      await fetchTodos(); // エラー時は再度取得
    }
  }

  // Todoの削除
  async function handleDelete(id: string) {
    try {
      const response = await fetch(API_ENDPOINTS.TODO(id), {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Todoの削除に失敗しました");

      // 成功したら状態を更新
      todos = todos.filter((todo) => todo.id !== id);
    } catch (e) {
      error = "Todoの削除に失敗しました。";
      await fetchTodos(); // エラー時は再度取得
    }
  }

  // フィルター変更
  function setFilter(newFilter: string) {
    console.log(`フィルターを変更: ${filter} -> ${newFilter}`);
    filter = newFilter;
  }
</script>

<div class="grid gap-6">
  <PageHeader />

  <!-- カード内にすべてのコンテンツを配置 -->
  <div class="rounded-lg border border-theme bg-theme-card shadow-theme transition-colors duration-200 p-6">
    <div class="grid gap-6">
      <!-- Todoフォーム -->
      <TodoForm onCreate={handleCreate} />

      <!-- フィルター -->
      <TodoFilter {filter} {setFilter} />

      <!-- エラー表示 -->
      <ErrorAlert message={error} />

      <!-- ローディング状態 -->
      {#if loading}
        <LoadingIndicator />
      {:else}
        <!-- Todoリスト -->
        <div class="grid gap-4">
          {#if filteredTodos.length > 0}
            <ul class="grid gap-2">
              {#each filteredTodos as todo (todo.id)}
                <li>
                  <TodoItem
                    {todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                </li>
              {/each}
            </ul>
          {:else}
            <EmptyState {filter} />
          {/if}

          <!-- タスク統計 -->
          <TodoStats {todos} />
        </div>
      {/if}
    </div>
  </div>
</div>
