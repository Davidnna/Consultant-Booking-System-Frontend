import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return navigate('/login');

    const fetchAll = async () => {
      try {
        const [u, c, b, a] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/consultants'),
          api.get('/admin/bookings'),
          api.get('/admin/analytics'),
        ]);
        setUsers(u.data);
        setConsultants(c.data);
        setBookings(b.data);
        setAnalytics(a.data);
      } catch (err) {
        setError('Failed to load admin data.');
      }
    };
    fetchAll();
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Admin Panel</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-600">Total Users</p>
          <h3 className="text-xl font-bold">{analytics.totalUsers}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-600">Total Consultants</p>
          <h3 className="text-xl font-bold">{analytics.totalConsultants}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-600">Total Bookings</p>
          <h3 className="text-xl font-bold">{analytics.totalBookings}</h3>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">📃 Bookings</h2>
        <table className="w-full text-left text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User</th>
              <th className="p-2">Consultant</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Verified</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{b.user?.name}</td>
                <td className="p-2">{b.consultant?.name}</td>
                <td className="p-2">{b.date}</td>
                <td className="p-2">{b.startTime}</td>
                <td className="p-2">{b.duration} mins</td>
                <td className="p-2">{b.verified ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🧑‍💼 Consultants</h2>
        <ul className="list-disc list-inside">
          {consultants.map((c, i) => (
            <li key={i}>{c.name} ({c.email})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">👥 Users</h2>
        <ul className="list-disc list-inside">
          {users.map((u, i) => (
            <li key={i}>{u.name} ({u.email})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}