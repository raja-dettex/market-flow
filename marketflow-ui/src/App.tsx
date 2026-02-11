import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkflowSheet from './pages/workflowSheet.tsx';
import Dashboard from './pages/dashboard';
import { Navbar } from './components/Navbar';
import Login from './pages/login.tsx';
import Profile from './pages/profile';
import ProtectRoute from './pages/protectRoute.tsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route element={<ProtectRoute/>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-workflow" element={<WorkflowSheet />} />
        <Route path="/workflows" element={<WorkflowSheet />} />
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
