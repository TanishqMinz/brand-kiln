import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';
import { Container, Typography, Box, Button, Paper } from '@mui/material';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const task = useAppSelector((state) => state.tasks.tasks.find((t) => t.id === id));

  if (!task) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Task not found
          </Typography>
          <Button component={Link} to="/tasks" variant="contained" color="primary">
            Back to Task List
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Details
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {task.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Due Date: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Status: {task.completed ? 'Completed' : 'Pending'}
          </Typography>
        </Paper>
        <Button component={Link} to="/tasks" variant="contained" color="primary">
          Back to Task List
        </Button>
      </Box>
    </Container>
  );
};

export default TaskDetails;

