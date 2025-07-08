import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Folder, Users, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/' && location.pathname === '/') ||
           (path === '/projects' && location.pathname.startsWith('/projects'));
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <Folder className="logo-icon" />
            <span className="logo-text">Project Tracker</span>
          </Link>

          {/* Desktop Navigation & Theme Toggle */}
          <div className="header-nav-actions">
            <nav className="nav-desktop">
              <Link 
                to="/" 
                className={clsx('nav-link', { 'nav-link-active': isActive('/') })}
              >
                <Folder size={18} />
                Projects
              </Link>
              <Link 
                to="/leaders" 
                className={clsx('nav-link', { 'nav-link-active': isActive('/leaders') })}
              >
                <Users size={18} />
                Leaders
              </Link>
            </nav>

            <div className="header-actions">
              <button 
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Mobile Menu Button */}
              <button 
                className="menu-button"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="nav-mobile">
            <Link 
              to="/" 
              className={clsx('nav-link-mobile', { 'nav-link-active': isActive('/') })}
              onClick={() => setIsMenuOpen(false)}
            >
              <Folder size={18} />
              Projects
            </Link>
            <Link 
              to="/leaders" 
              className={clsx('nav-link-mobile', { 'nav-link-active': isActive('/leaders') })}
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={18} />
              Leaders
            </Link>
            <button 
              className="theme-toggle-mobile"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
