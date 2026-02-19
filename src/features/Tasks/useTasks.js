import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateTaskId } from '../../utils/idGenerator';
import { getCreatedAt } from '../../utils/dateHelpers';
import mockTasks from '../../mocks/tasks.json';

export const useTasks = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', mockTasks);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getFiltered = () => {
    let result = tasks;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (filter === 'pending') {
      result = result.filter((t) => !t.completed);
    }

    const priorityOrder = { high: 3, medium: 2, low: 1 };

    result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      const aPri = priorityOrder[a.priority] || 2;
      const bPri = priorityOrder[b.priority] || 2;
      if (aPri !== bPri) return bPri - aPri;

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  };

  const getById = useCallback(
    (id) => tasks.find((t) => t.id === id) || null,
    [tasks]
  );

  const save = useCallback(
    (data) => {
      const isEditOp = data.id && tasks.some((t) => t.id === data.id);
      if (isEditOp) {
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
        setSuccessMessage('Task updated successfully!');
      } else {
        const newTask = {
          ...data,
          id: data.id || generateTaskId(),
          createdAt: data.createdAt || getCreatedAt(),
          completed: data.completed || false,
        };
        setTasks([...tasks, newTask]);
        setSuccessMessage('Task added successfully!');
      }
    },
    [tasks, setTasks]
  );

  const remove = useCallback(
    (id) => {
      setTasks(tasks.filter((t) => t.id !== id));
      setSuccessMessage('Task deleted successfully!');
    },
    [tasks, setTasks]
  );

  const toggleComplete = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const updated = { ...task, completed: !task.completed };
        setTasks(tasks.map((t) => (t.id === id ? updated : t)));
        return updated;
      }
      return null;
    },
    [tasks, setTasks]
  );

  return {
    tasks: getFiltered(),
    allTasks: tasks,
    search,
    setSearch,
    filter,
    setFilter,
    successMessage,
    setSuccessMessage,
    getById,
    save,
    remove,
    toggleComplete,
  };
};
