import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import TaskDashboard from './components/TaskDashboard';
import TaskDetails from './components/TaskDetails.tsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<TaskDashboard />} />
            <Route path="/tasks" element={<TaskDashboard />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

