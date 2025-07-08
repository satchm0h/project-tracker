import React, { useState, useEffect } from 'react';

function LeaderList() {
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });

  const fetchLeaders = () => {
    fetch('/api/leaders')
      .then((res) => res.json())
      .then((data) => setLeaders(data));
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    fetch('/api/leaders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(() => {
        setForm({ name: '', email: '' });
        fetchLeaders();
      });
  };

  const handleDelete = (id) => {
    fetch(`/api/leaders/${id}`, { method: 'DELETE' }).then(() => fetchLeaders());
  };

  return (
    <div>
      <h2>Development Leaders</h2>
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
