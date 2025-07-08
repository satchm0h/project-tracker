import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/layout/Header';
import ProjectDashboard from './components/project/ProjectDashboard';
import ProjectForm from './ProjectForm';
import LeaderList from './LeaderList';
import LeaderForm from './LeaderForm';
import './global.css';

function About() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <h2>About Project Tracker</h2>
        <p>
          Project Tracker is a modern web application designed to help teams manage and track their development projects efficiently.
        </p>
        <h3>Features</h3>
        <ul>
          <li>Create and manage projects with detailed information</li>
          <li>Track development leaders and team assignments</li>
          <li>Search and filter projects easily</li>
          <li>Modern, responsive interface</li>
        </ul>
        <h3>Technology Stack</h3>
        <ul>
          <li>Frontend: React with modern UI components</li>
          <li>Backend: Flask REST API</li>
          <li>Database: SQLite with SQLAlchemy</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProjectDashboard />} />
            <Route path="/projects" element={<ProjectDashboard />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectForm />} />
            <Route path="/leaders" element={<LeaderList />} />
            <Route path="/leaders/new" element={<LeaderForm />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
