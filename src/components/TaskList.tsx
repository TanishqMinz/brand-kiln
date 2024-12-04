import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../store/taskSlice';

interface TaskListProps {
  tasks: Task[];
  filter: 'all' | 'completed' | 'pending' | 'overdue';
  searchQuery: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
}

const SortableTaskItem: React.FC<{ task: Task } & Omit<TaskListProps, 'tasks' | 'filter' | 'searchQuery'>> = ({
  task,
  onEdit,
  onDelete,
  onToggleCompletion,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      secondaryAction={
        <ListItemSecondaryAction sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(task)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton edge="end" aria-label="drag" {...attributes} {...listeners}>
            <DragIndicatorIcon />
          </IconButton>
        </ListItemSecondaryAction>
      }
    >
      <Checkbox
        edge="start"
        checked={task.completed}
        tabIndex={-1}
        disableRipple
        onChange={() => onToggleCompletion(task.id)}
      />
      <ListItemText 
        primary={task.title} 
        secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
        sx={{ mr: 12 }} // Increased right margin
      />
    </ListItem>
  );
};

const TaskList: React.FC<TaskListProps> = ({ tasks, filter, searchQuery, onEdit, onDelete, onToggleCompletion }) => {
  const filteredTasks = tasks
    .filter((task) => {
      switch (filter) {
        case 'completed':
          return task.completed;
        case 'pending':
          return !task.completed;
        case 'overdue':
          return !task.completed && new Date(task.dueDate) < new Date();
        default:
          return true;
      }
    })
    .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <List>
      {filteredTasks.map((task) => (
        <SortableTaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </List>
  );
};

export default TaskList;

