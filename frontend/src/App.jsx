import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import EditUser from './pages/EditUser';

function App() {
// block for js
  return (
    <Router>
      <Toaster/>
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register"element={<Register/>} />
        {/* <Route path="/contact"element={<Contact/>} /> */}
        <Route path="/dashboard"element={<Dashboard/>} />
        <Route path="/editUser/:id"element={<EditUser/>} />
        </Routes>
    </Router>
  )
}

export default App
