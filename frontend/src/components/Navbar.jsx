import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">CareTrack</Link>
      <div className="flex gap-4 items-center">
        {user && (
          <>
            <span className="text-sm">{user.full_name} ({user.role})</span>
            {user.role === 'doctor' && (
              <>
                <Link to="/doctor" className="hover:underline">Dashboard</Link>
                <Link to="/add-patient" className="hover:underline">Add Patient</Link>
              </>
            )}
            {user.role === 'patient' && (
              <Link to="/me" className="hover:underline">My Home</Link>
            )}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}