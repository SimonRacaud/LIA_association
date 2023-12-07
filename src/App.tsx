import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import UserProvider from './context/UserContext'
import { routes } from 'router/Routes';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {routes.map((route) => {
              let element = route.element
              if (route.protected) {
                element = (<ProtectedRoute>{element}</ProtectedRoute>)
              }
              return (<Route path={route.path} element={element} />)
          })}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
