import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Mail, Trash2, AlertCircle } from 'lucide-react';
import {
  getLeaders,
  deleteLeader,
} from './services/api';
import './LeaderList.css';

function LeaderList() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
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

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      deleteLeader(id)
        .then(() => fetchLeadersList())
        .catch((err) => setError(err.message));
    }
  };

  if (loading) {
    return (
      <div className="leaders-container">
        <div className="leaders-loading">
          <div className="loading-spinner"></div>
          <p>Loading leaders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaders-container">
      <div className="leaders-header">
        <div className="leaders-title">
          <Users className="title-icon" />
          <h1>Development Leaders</h1>
        </div>
        <p className="leaders-subtitle">
          Manage the development team leaders for your projects
        </p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="leaders-action-bar">
        <div className="leaders-list-header">
          <h2>Development Leaders ({leaders.length})</h2>
        </div>
        <button
          onClick={() => navigate('/leaders/new')}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Add Leader
        </button>
      </div>

      {/* Leaders List */}
      <div className="leaders-content">
        {leaders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={48} />
            </div>
            <h3>No leaders yet</h3>
            <p>Add your first development leader to get started.</p>
            <button
              onClick={() => navigate('/leaders/new')}
              className="btn btn-primary"
            >
              <Plus size={18} />
              Add First Leader
            </button>
          </div>
        ) : (
          <div className="leaders-grid">
            {leaders.map((leader) => (
              <div key={leader.id} className="leader-card">
                <div className="leader-info">
                  <div className="leader-avatar">
                    <Users size={24} />
                  </div>
                  <div className="leader-details">
                    <h3 className="leader-name">{leader.name}</h3>
                    <div className="leader-email">
                      <Mail size={16} />
                      <span>{leader.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(leader.id, leader.name)}
                  className="btn btn-secondary btn-sm leader-delete"
                  title="Remove leader"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderList;
