import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectForm from '../ProjectForm';
import * as api from '../services/api';
import { ThemeProvider } from '../contexts/ThemeContext';

const navigate = vi.fn();

vi.mock('../services/api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({}),
  };
});

describe('ProjectForm', () => {
  beforeEach(() => {
    navigate.mockReset();
    api.createProject.mockReset();
    api.getLeaders.mockResolvedValue([
      { id: 1, name: 'Alice', email: 'alice@example.com' }
    ]);
  });

  it('submits new project', async () => {
    api.createProject.mockResolvedValue({});
    render(
      <ThemeProvider>
        <MemoryRouter>
          <ProjectForm />
        </MemoryRouter>
      </ThemeProvider>
    );
    
    // Wait for the form to load
    await waitFor(() => expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument());
    
    // Fill out the form using better selectors
    fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: 'New Project' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Project Description' } });
    fireEvent.change(screen.getByLabelText(/Primary Contact Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Primary Contact Email/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByLabelText(/Development Leader/i), { target: { value: 'Alice' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));
    
    await waitFor(() => expect(api.createProject).toHaveBeenCalled());
  });
});
