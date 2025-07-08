import React, { useState } from 'react';
import { Search, Filter, X, Users, Calendar, SortAsc, SortDesc } from 'lucide-react';
import clsx from 'clsx';
import './SearchAndFilter.css';

function SearchAndFilter({ 
  searchTerm, 
  onSearchChange, 
  leaders, 
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange 
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    leader: '',
    hasUrl: '',
  });

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { leader: '', hasUrl: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="search-and-filter">
      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx('btn btn-secondary', { 'btn-active': hasActiveFilters })}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(v => v).length}</span>}
          </button>

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value, sortOrder)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="leader">Sort by Leader</option>
              <option value="created">Sort by Created Date</option>
            </select>
            <button
              onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary btn-sm"
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Development Leader</label>
              <select
                value={filters.leader}
                onChange={(e) => handleFilterChange('leader', e.target.value)}
                className="filter-select"
              >
                <option value="">All Leaders</option>
                {leaders.map((leader) => (
                  <option key={leader.id} value={leader.name}>
                    {leader.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Project URL</label>
              <select
                value={filters.hasUrl}
                onChange={(e) => handleFilterChange('hasUrl', e.target.value)}
                className="filter-select"
              >
                <option value="">All Projects</option>
                <option value="true">Has URL</option>
                <option value="false">No URL</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="filter-actions">
              <button
                onClick={clearFilters}
                className="btn btn-secondary btn-sm"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAndFilter;
