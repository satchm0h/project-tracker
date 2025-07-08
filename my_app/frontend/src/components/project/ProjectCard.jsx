import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Edit, ExternalLink, Mail, User } from 'lucide-react';
import './ProjectCard.css';

function ProjectCard({ project, leaders = [] }) {
  // Find the email for the current project's development leader
  const leaderEmail = useMemo(() => {
    const leader = leaders.find(l => l.name === project.development_leader);
    return leader ? leader.email : null;
  }, [leaders, project.development_leader]);
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3 className="project-title">
          <Link to={`/projects/${project.id}`} className="project-title-link">
            {project.name}
          </Link>
        </h3>
        <div className="project-actions">
          <Link 
            to={`/projects/${project.id}`}
            className="btn btn-secondary btn-sm"
            title="Edit project"
          >
            <Edit size={16} />
          </Link>
          {project.url && (
            <a 
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="View project"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
      
      <div className="project-description">
        <p>{project.description}</p>
      </div>
      
      <div className="project-meta">
        {project.development_leader && (
          <div className="project-meta-item">
            <User size={16} className="project-meta-icon" />
            <span className="project-meta-label">Leader:</span>
            {leaderEmail ? (
              <a 
                href={`mailto:${leaderEmail}`}
                className="project-meta-value project-leader-link"
                title={`Send email to ${project.development_leader}`}
              >
                {project.development_leader}
              </a>
            ) : (
              <span className="project-meta-value">{project.development_leader}</span>
            )}
          </div>
        )}
        
        {project.primary_contact_email && (
          <div className="project-meta-item">
            <Mail size={16} className="project-meta-icon" />
            <span className="project-meta-label">Contact:</span>
            <a 
              href={`mailto:${project.primary_contact_email}`}
              className="project-meta-value project-contact-link"
              title={`Send email to ${project.primary_contact_name}`}
            >
              {project.primary_contact_name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
