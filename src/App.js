import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login';
import Home from './components/Home';
import Signup from './components/auth/Signup';
import AuthGuard from './components/service/authGuard';
import Configuracoes from './components/configuracoes/Configuracoes';
import { ThemeProvider } from './components/configuracoes/ThemeContext';
function App() {
  return (
    <ThemeProvider> {/* Envolver a aplicação com o ThemeProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/configuracoes" element={<AuthGuard><Configuracoes /></AuthGuard>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
