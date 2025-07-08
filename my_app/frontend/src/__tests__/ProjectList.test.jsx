import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProjectList from '../ProjectList';
import * as api from '../services/api';

vi.mock('../services/api');

describe('ProjectList', () => {
  it('renders projects from API', async () => {
    api.getProjects.mockResolvedValue([
      { id: 1, name: 'A', description: 'First' },
    ]);
    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>
    );
    expect(await screen.findByText('A')).toBeInTheDocument();
  });

  it('shows error on failure', async () => {
    api.getProjects.mockRejectedValue(new Error('boom'));
    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Error:/)).toHaveTextContent('boom');
  });
});
