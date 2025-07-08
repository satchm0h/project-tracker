import React, { useState, useEffect } from 'react';
import {
  getLeaders,
  createLeader,
  deleteLeader,
} from './services/api';

function LeaderList() {
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeadersList = () => {
    setLoading(true);
    getLeaders()
      .then((data) => setLeaders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeadersList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createLeader(form)
      .then(() => {
        setForm({ name: '', email: '' });
        fetchLeadersList();
      })
      .catch((err) => setError(err.message));
  };

  const handleDelete = (id) => {
    deleteLeader(id)
      .then(() => fetchLeadersList())
      .catch((err) => setError(err.message));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Development Leaders</h2>
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleCreate}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {leaders.map((l) => (
          <li key={l.id}>
            {l.name} ({l.email}){' '}
            <button onClick={() => handleDelete(l.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaderList;
