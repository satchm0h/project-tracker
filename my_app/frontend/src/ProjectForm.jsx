import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProject,
  createProject,
  updateProject,
} from './services/api';

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
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      getProject(id)
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const request = isEditing
      ? updateProject(id, formData)
      : createProject(formData);
    request
      .then(() => navigate('/projects'))
      .catch((err) => {
        setSaving(false);
        setError(err.message);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>Error: {error}</p>}
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
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

export default ProjectForm;
