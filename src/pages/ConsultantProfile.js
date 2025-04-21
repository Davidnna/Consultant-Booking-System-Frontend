import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ConsultantProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/consultants/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error loading profile', err);
      }
    };
    loadProfile();
  }, [id]);

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{profile.user.name}</h1>
      <p className="text-gray-700 mb-4">{profile.user.email}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Specialties:</h3>
        <ul className="list-disc list-inside">
          {profile.specialties.map((s, idx) => <li key={idx}>{s}</li>)}
        </ul>
      </div>

      <p><b>💲 Pricing:</b> ${profile.pricing} / session</p>

      <div className="mt-4">
        <h3 className="font-semibold mb-1">📆 Availability:</h3>
        <ul className="list-inside list-disc">
          {profile.availability.map((a, i) => (
            <li key={i}>{a.day}: {a.slots.join(', ')}</li>
          ))}
        </ul>
      </div>

      <Link to={`/book/${profile.user._id}`}>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Book Appointment</button>
      </Link>
    </div>
  );
}