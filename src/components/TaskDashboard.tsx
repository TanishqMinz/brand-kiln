import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import {
  addTask,
  editTask,
  deleteTask,
  toggleTaskCompletion,
  setFilter,
  setSearchQuery,
  reorderTasks,
  Task,
} from '../store/taskSlice';
import { Container, Typography, Box, Grid, Button, TextField } from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import ConfirmationModal from './ConfirmationModal';

const TaskDashboard: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const filter = useAppSelector((state) => state.tasks.filter);
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    dispatch(addTask(task));
    setIsFormOpen(false);
  };

  const handleEditTask = (task: Task | Omit<Task, 'id'>) => {
    if ('id' in task) {
      dispatch(editTask(task as Task));
    } else {
      console.error('Cannot edit a task without an id');
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setDeleteConfirmation({ open: true, taskId: id });
  };

  const confirmDeleteTask = () => {
    if (deleteConfirmation.taskId) {
      dispatch(deleteTask(deleteConfirmation.taskId));
    }
    setDeleteConfirmation({ open: false, taskId: null });
  };

  const handleToggleCompletion = (id: string) => {
    dispatch(toggleTaskCompletion(id));
  };

  const handleFilterChange = (newFilter: 'all' | 'completed' | 'pending' | 'overdue') => {
    dispatch(setFilter(newFilter));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      dispatch(reorderTasks({ startIndex: oldIndex, endIndex: newIndex }));
    }
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management Dashboard
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <TaskFilter currentFilter={filter} onFilterChange={handleFilterChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search tasks"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
            />
          </Grid>
        </Grid>
        <Box mt={2} mb={2}>
          <Button variant="contained" color="primary" onClick={() => setIsFormOpen(true)}>
            Add New Task
          </Button>
        </Box>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <TaskList
              tasks={tasks}
              filter={filter}
              searchQuery={searchQuery}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onToggleCompletion={handleToggleCompletion}
            />
          </SortableContext>
        </DndContext>
        <TaskForm
          open={isFormOpen || !!editingTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? (task) => handleEditTask(task as Task) : handleAddTask}
          initialData={editingTask}
        />
        <ConfirmationModal
          open={deleteConfirmation.open}
          onClose={() => setDeleteConfirmation({ open: false, taskId: null })}
          onConfirm={confirmDeleteTask}
          title="Delete Task"
          content="Are you sure you want to delete this task?"
        />
      </Box>
    </Container>
  );
};

export default TaskDashboard;

