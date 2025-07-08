import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const emptyProject = {
  name: '',
  description: '',
  primary_contact_name: '',
  primary_contact_email: '',
  url: '',
  development_leader: '',
};

function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [formData, setFormData] = useState(emptyProject);

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/projects/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Project not found');
          return res.json();
        })
        .then((data) => setFormData(data))
        .catch(() => setFormData(emptyProject));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/projects/${id}` : '/api/projects';
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => navigate('/projects'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit' : 'Create'} Project</h2>
      <div>
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Primary Contact Name:</label>
        <input
          name="primary_contact_name"
          value={formData.primary_contact_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Primary Contact Email:</label>
        <input
          name="primary_contact_email"
          value={formData.primary_contact_email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Project URL:</label>
        <input name="url" value={formData.url} onChange={handleChange} />
      </div>
      <div>
        <label>Development Leader:</label>
        <input
          name="development_leader"
          value={formData.development_leader}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}

export default ProjectForm;
