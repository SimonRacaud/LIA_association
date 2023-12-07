import React from 'react';
import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import SignIn from './page/signin/SignIn';
import SignUp from './page/signup/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import { config } from 'dotenv';

config()

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={SignIn} />
        <Route path='/' element={<ProtectedRoute><SignUp /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
