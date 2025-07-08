import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import LeaderList from './LeaderList';

function Home() {
  return <h1>Project Tracker SPA</h1>;
}

function About() {
  return <h2>About</h2>;
}

function App() {
  return (
    <div>
      <nav>
        <Link to="/projects">Projects</Link> |{' '}
        <Link to="/leaders">Leaders</Link> |{' '}
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id" element={<ProjectForm />} />
        <Route path="/leaders" element={<LeaderList />} />
      </Routes>
    </div>
  );
}

export default App;
