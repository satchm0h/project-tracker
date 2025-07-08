import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import ProjectCard from './ProjectCard';
import SearchAndFilter from '../ui/SearchAndFilter';
import { getProjects, getLeaders } from '../../services/api';
import './ProjectDashboard.css';

function ProjectDashboard() {
  const [projects, setProjects] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ leader: '', hasUrl: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter and sort projects
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.development_leader.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.leader) {
      filtered = filtered.filter(project => project.development_leader === filters.leader);
    }

    if (filters.hasUrl === 'true') {
      filtered = filtered.filter(project => project.url);
    } else if (filters.hasUrl === 'false') {
      filtered = filtered.filter(project => !project.url);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'leader':
          aValue = a.development_leader;
          bValue = b.development_leader;
          break;
        case 'created':
          aValue = a.id; // Using ID as proxy for creation order
          bValue = b.id;
          break;
        case 'name':
        default:
          aValue = a.name;
          bValue = b.name;
          break;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters, sortBy, sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, leadersData] = await Promise.all([
        getProjects(),
        getLeaders(),
      ]);
      setProjects(projectsData);
      setLeaders(leadersData);
      setFilteredProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Error loading projects</h3>
        <p>{error}</p>
        <button onClick={loadData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Project Tracker</h1>
              <p className="hero-subtitle">
                Manage and track your development projects in one place
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Folder className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{projects.length}</div>
                  <div className="stat-label">Total Projects</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp className="stat-icon-svg" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{projects.filter(p => p.development_leader).length}</div>
                  <div className="stat-label">Active Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter */}
      <div className="container">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          leaders={leaders}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Action Bar */}
      <div className="container">
        <div className="action-bar">
        <div className="action-bar-left">
          {leaders.length === 0 ? (
            <div className="no-leaders-warning">
              <Link to="/leaders" className="btn btn-primary">
                <Users size={18} />
                Add Leaders First
              </Link>
            </div>
          ) : (
            <Link to="/projects/new" className="btn btn-primary">
              <Plus size={18} />
              New Project
            </Link>
          )}
        </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="container">
        <div className="results-info">
          <h2 className="results-title">
            {searchTerm 
              ? `Found ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`
              : 'All Projects'
            }
          </h2>
          {searchTerm && (
            <p className="results-subtitle">
              Showing results for "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container">
        <div className="projects-section">
        {leaders.length === 0 ? (
          <div className="no-leaders-alert">
            <div className="alert-icon">
              <AlertTriangle size={48} />
            </div>
            <h3>No Development Leaders</h3>
            <p>
              Projects cannot be created until at least one development leader has been added to the system.
              Development leaders are required to assign responsibility for each project.
            </p>
            <div className="alert-actions">
              <Link to="/leaders" className="btn btn-primary">
                <Users size={18} />
                Add Development Leaders
              </Link>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Folder size={48} />
            </div>
            <h3>No projects found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search terms or create a new project.'
                : 'Get started by creating your first project.'
              }
            </p>
            <Link to="/projects/new" className="btn btn-primary">
              <Plus size={18} />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} leaders={leaders} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
