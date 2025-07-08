import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

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
