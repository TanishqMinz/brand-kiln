import React from 'react';
import { ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';

interface TaskFilterProps {
  currentFilter: 'all' | 'completed' | 'pending' | 'overdue';
  onFilterChange: (filter: 'all' | 'completed' | 'pending' | 'overdue') => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ToggleButtonGroup
      value={currentFilter}
      exclusive
      onChange={(_, newFilter) => newFilter && onFilterChange(newFilter)}
      aria-label="task filter"
      size={isMobile ? "small" : "medium"}
      orientation={isMobile ? "vertical" : "horizontal"}
      fullWidth={isMobile}
    >
      <ToggleButton value="all" aria-label="all tasks">
        All
      </ToggleButton>
      <ToggleButton value="completed" aria-label="completed tasks">
        Completed
      </ToggleButton>
      <ToggleButton value="pending" aria-label="pending tasks">
        Pending
      </ToggleButton>
      <ToggleButton value="overdue" aria-label="overdue tasks">
        Overdue
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TaskFilter;

