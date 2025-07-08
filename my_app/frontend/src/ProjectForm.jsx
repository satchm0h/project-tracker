import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Users } from 'lucide-react';
import FormField from './components/ui/FormField';
import {
  getProject,
  createProject,
  updateProject,
  getLeaders,
} from './services/api';
import './ProjectForm.css';

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
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [id, isEditing]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && !isEditing) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('projectForm_draft', JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, isDirty, isEditing]);

  // Load draft on mount for new projects
  useEffect(() => {
    if (!isEditing) {
      const draft = localStorage.getItem('projectForm_draft');
      if (draft) {
        try {
          const parsedDraft = JSON.parse(draft);
          setFormData(parsedDraft);
          setIsDirty(true);
        } catch (err) {
          console.error('Error loading draft:', err);
        }
      }
    }
  }, [isEditing]);

  useEffect(() => {
    loadInitialData();
  }, [id, isEditing]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load leaders first
      const leadersData = await getLeaders();
      setLeaders(leadersData);
      
      // If editing, load project data
      if (isEditing) {
        const projectData = await getProject(id);
        setFormData(projectData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Project name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.development_leader) {
      errors.development_leader = 'Development leader is required';
    }
    
    if (!formData.primary_contact_name.trim()) {
      errors.primary_contact_name = 'Primary contact name is required';
    }
    
    if (!formData.primary_contact_email.trim()) {
      errors.primary_contact_email = 'Primary contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primary_contact_email)) {
      errors.primary_contact_email = 'Please enter a valid email address';
    }
    
    if (formData.url && !/^https?:\/\/.+/.test(formData.url)) {
      errors.url = 'Please enter a valid URL starting with http:// or https://';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below before submitting');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    const request = isEditing
      ? updateProject(id, formData)
      : createProject(formData);
      
    request
      .then(() => {
        // Clear draft on successful save
        localStorage.removeItem('projectForm_draft');
        navigate('/');
      })
      .catch((err) => {
        setSaving(false);
        setError(err.message);
      });
  };

  if (loading) {
    return (
      <div className="form-container">
        <div className="form-loading">
          <div className="loading-spinner"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }

  // Check if no leaders exist
  if (leaders.length === 0) {
    return (
      <div className="form-container">
        <div className="form-header">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>
          <h1>Create New Project</h1>
        </div>
        
        <div className="no-leaders-message">
          <div className="no-leaders-icon">
            <Users size={48} />
          </div>
          <h3>No Development Leaders Found</h3>
          <p>
            Projects cannot be created until at least one development leader has been added to the system.
          </p>
          <div className="no-leaders-actions">
            <button 
              onClick={() => navigate('/leaders')}
              className="btn btn-primary"
            >
              <Users size={18} />
              Add Development Leaders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-form-container">
      <div className="project-form-header">
        <button 
          onClick={() => navigate('/')}
          className="project-form-back-button"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>
        <div className="project-form-header-content">
          <h1>{isEditing ? 'Edit Project' : 'Create New Project'}</h1>
          {isDirty && !isEditing && (
            <div className="project-form-draft-indicator">
              Draft auto-saved
            </div>
          )}
        </div>
        {isDirty && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormData(emptyProject);
              setIsDirty(false);
              setFieldErrors({});
              localStorage.removeItem('projectForm_draft');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Draft
          </button>
        )}
      </div>

      <div className="project-form-card">
        {error && (
          <div className="project-form-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="project-form">
          <FormField
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
            placeholder="Enter project name"
          />

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={fieldErrors.description}
            required
            as="textarea"
            placeholder="Describe your project..."
            rows={4}
          />

          <FormField
            label="Primary Contact Name"
            name="primary_contact_name"
            value={formData.primary_contact_name}
            onChange={handleChange}
            error={fieldErrors.primary_contact_name}
            required
            placeholder="Enter contact name"
          />

          <FormField
            label="Primary Contact Email"
            name="primary_contact_email"
            type="email"
            value={formData.primary_contact_email}
            onChange={handleChange}
            error={fieldErrors.primary_contact_email}
            required
            placeholder="Enter email address"
          />

          <FormField
            label="Project URL"
            name="url"
            type="url"
            value={formData.url}
            onChange={handleChange}
            error={fieldErrors.url}
            placeholder="https://example.com"
            help="Optional: Link to project repository or website"
          />

          <FormField
            label="Development Leader"
            name="development_leader"
            value={formData.development_leader}
            onChange={handleChange}
            error={fieldErrors.development_leader}
            required
            as="select"
            help="Select the leader whose team the project was developed within."
          >
            <option value="">Select a development leader...</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.name}>
                {leader.name} ({leader.email})
              </option>
            ))}
          </FormField>

          <div className="project-form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="btn-spinner"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
