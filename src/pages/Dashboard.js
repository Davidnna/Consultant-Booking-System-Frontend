import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {user.role === 'admin' && (
        <div>
          <h2 className="text-xl mb-2">📊 Admin Panel</h2>
          <button onClick={() => navigate('/admin')} className="bg-blue-600 text-white px-3 py-2 rounded">Go to Admin Dashboard</button>
        </div>
      )}

      {user.role === 'consultant' && (
        <div>
          <h2 className="text-xl mb-2">🧑‍💼 Consultant Tools</h2>
          <button onClick={() => navigate(`/consultants/${user._id}`)} className="bg-green-600 text-white px-3 py-2 rounded mr-3">My Profile</button>
          <button onClick={() => navigate(`/book/${user._id}`)} className="bg-yellow-500 text-white px-3 py-2 rounded">Book Me</button>
        </div>
      )}

      {user.role === 'user' && (
        <div>
          <h2 className="text-xl mb-2">🔍 Book a Consultant</h2>
          <button onClick={() => navigate('/consultants')} className="bg-indigo-600 text-white px-3 py-2 rounded">Browse Consultants</button>
        </div>
      )}
    </div>
  );
}