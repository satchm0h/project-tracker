import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from './services/api';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects()
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Projects</h2>
      <Link to="/projects/new">Create Project</Link>
      <div>
        {projects.map((p) => (
          <div key={p.id} className="project-card">
            <h3>
              <Link to={`/projects/${p.id}`}>{p.name}</Link>
            </h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
