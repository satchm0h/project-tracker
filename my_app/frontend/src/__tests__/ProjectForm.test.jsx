import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectForm from '../ProjectForm';
import * as api from '../services/api';

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
  });

  it('submits new project', async () => {
    api.createProject.mockResolvedValue({});
    render(
      <MemoryRouter>
        <ProjectForm />
      </MemoryRouter>
    );
    const nameInput = document.querySelector('input[name="name"]');
    const descInput = document.querySelector('textarea[name="description"]');
    const contactName = document.querySelector('input[name="primary_contact_name"]');
    const contactEmail = document.querySelector('input[name="primary_contact_email"]');
    const leaderInput = document.querySelector('input[name="development_leader"]');
    fireEvent.change(nameInput, { target: { value: 'New' } });
    fireEvent.change(descInput, { target: { value: 'Desc' } });
    fireEvent.change(contactName, { target: { value: 'Bob' } });
    fireEvent.change(contactEmail, { target: { value: 'bob@example.com' } });
    fireEvent.change(leaderInput, { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(api.createProject).toHaveBeenCalled());
  });
});
