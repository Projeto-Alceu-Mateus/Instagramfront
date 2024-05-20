import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/login';
import Home from './components/Home';
import Signup from './components/auth/Signup';
import AuthGuard from './components/service/authGuard';
import Configuracoes from './components/configuracoes/Configuracoes';
import UserProfile from './components/perfil/UserProfile';
import PostDetails from './components/post/PostDetails';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/perfil/:username" element={<UserProfile />} />
        <Route path="/configuracoes" element={<AuthGuard><Configuracoes /></AuthGuard>} />
        <Route path="/p/:postId" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
