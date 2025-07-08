import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Users } from 'lucide-react';
import FormField from './components/ui/FormField';
import {
  getLeaders,
  createLeader,
} from './services/api';
import './LeaderForm.css';

const emptyLeader = {
  name: '',
  email: '',
};

function LeaderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyLeader);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('leaderForm_draft', JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, isDirty]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('leaderForm_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setIsDirty(true);
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    }
  }, []);

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
      errors.name = 'Leader name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Leader name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
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
    
    createLeader(formData)
      .then(() => {
        // Clear draft on successful save
        localStorage.removeItem('leaderForm_draft');
        navigate('/leaders');
      })
      .catch((err) => {
        setSaving(false);
        setError(err.message);
      });
  };

  return (
    <div className="leader-form-container">
      <div className="leader-form-header">
        <button 
          onClick={() => navigate('/leaders')}
          className="leader-form-back-button"
        >
          <ArrowLeft size={18} />
          Back to Leaders
        </button>
        <h1>Add New Development Leader</h1>
      </div>

      {isDirty && (
        <div className="leader-form-draft-indicator">
          <Save size={16} />
          Draft auto-saved
        </div>
      )}

      <div className="leader-form-card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="leader-form-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

        <div className="form-grid">
          <FormField
            label="Leader Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
            placeholder="Enter leader name"
            help="Full name of the development team leader"
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
            placeholder="Enter email address"
            help="Primary email address for team communications"
          />
        </div>

          <div className="leader-form-actions">
            <button
              type="button"
              onClick={() => navigate('/leaders')}
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
                  <div className="leader-form-spinner"></div>
                  Adding Leader...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Add Leader
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaderForm;
