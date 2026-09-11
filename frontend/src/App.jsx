import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import AddPatient from './pages/AddPatient';
import PatientDetail from './pages/PatientDetail';
import PatientHome from './pages/PatientHome';
import LogReading from './pages/LogReading';

function Private({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor" element={<Private role="doctor"><DoctorDashboard /></Private>} />
          <Route path="/add-patient" element={<Private role="doctor"><AddPatient /></Private>} />
          <Route path="/patient/:id" element={<Private role="doctor"><PatientDetail /></Private>} />
          <Route path="/me" element={<Private role="patient"><PatientHome /></Private>} />
          <Route path="/log" element={<Private role="patient"><LogReading /></Private>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}