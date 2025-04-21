import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BookAppointment() {
  const { id } = useParams(); // consultantId
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    date: '',
    startTime: '',
    duration: 60,
    platform: 'Google Meet',
    meetingLink: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/consultants/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Could not load consultant profile.');
      }
    };
    loadProfile();
  }, [id]);

  const handleBook = async () => {
    try {
      const bookingRes = await api.post('/bookings', {
        consultantId: id,
        date: form.date,
        startTime: form.startTime,
        duration: form.duration,
        platform: form.platform,
        meetingLink: form.meetingLink
      });

      const bookingId = bookingRes.data._id;

      const verifyRes = await api.post('/payments/verify', {
        code: form.verificationCode,
        bookingId
      });

      setSuccess(verifyRes.data.msg);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed');
    }
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Book {profile.user.name}</h1>

      <label>Date:</label>
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border p-2 rounded mb-3" />

      <label>Start Time:</label>
      <select value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full border p-2 rounded mb-3">
        <option value="">--Select--</option>
        {(profile.availability.find(a => a.day === new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' }))?.slots || []).map((slot, i) => (
          <option key={i} value={slot}>{slot}</option>
        ))}
      </select>

      <label>Duration:</label>
      <select value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })} className="w-full border p-2 rounded mb-3">
        <option value={30}>30 minutes</option>
        <option value={60}>1 hour</option>
        <option value={90}>1.5 hours</option>
        <option value={120}>2 hours</option>
        <option value={180}>3 hours</option>
      </select>

      <label>Platform:</label>
      <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full border p-2 rounded mb-3">
        <option>Zoom</option>
        <option>Google Meet</option>
        <option>Skype</option>
      </select>

      <label>Meeting Link:</label>
      <input type="text" placeholder="https://meet..." value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} className="w-full border p-2 rounded mb-3" />

      <label>Verification Code:</label>
      <input type="text" placeholder="ABC123" value={form.verificationCode} onChange={(e) => setForm({ ...form, verificationCode: e.target.value })} className="w-full border p-2 rounded mb-3" />

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded">Confirm Booking</button>
    </div>
  );
}