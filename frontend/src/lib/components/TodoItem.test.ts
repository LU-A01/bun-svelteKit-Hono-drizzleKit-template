import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TodoItem from './TodoItem.svelte';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'テストタスク',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should render the todo title', async () => {
    const { getByText } = render(TodoItem, {
      props: {
        todo: mockTodo,
      },
    });

    expect(getByText('テストタスク')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const { getByRole } = render(TodoItem, {
      props: {
        todo: mockTodo,
        onToggle,
      },
    });

    const checkbox = getByRole('checkbox');
    await fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith('1', true);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { getByLabelText } = render(TodoItem, {
      props: {
        todo: mockTodo,
        onDelete,
      },
    });

    const deleteButton = getByLabelText('タスクを削除');
    await fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should show completed style when todo is completed', () => {
    const completedTodo = {
      ...mockTodo,
      completed: true,
    };

    const { getByText } = render(TodoItem, {
      props: {
        todo: completedTodo,
      },
    });

    const titleElement = getByText('テストタスク');
    expect(titleElement).toHaveClass('line-through');
  });
});
