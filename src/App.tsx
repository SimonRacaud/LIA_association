import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import UserProvider from './context/UserContext'
import { routes } from 'router/Routes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <UserProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {routes.map((route) => {
                let element = route.element
                if (route.protected) {
                  element = (<ProtectedRoute key={route.path}>{element}</ProtectedRoute>)
                }
                return (<Route key={route.path} path={route.path} element={element} />)
            })}
          </Routes>
        </Router>
      </LocalizationProvider>
    </UserProvider>
  );
}

export default App;
