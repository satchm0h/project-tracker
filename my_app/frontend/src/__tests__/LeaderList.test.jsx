import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeaderList from '../LeaderList';
import * as api from '../services/api';

vi.mock('../services/api');

describe('LeaderList', () => {
  beforeEach(() => {
    api.getLeaders.mockReset();
    api.createLeader.mockReset();
  });

  it('renders leaders from API', async () => {
    api.getLeaders.mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@example.com' }]);
    render(
      <MemoryRouter>
        <LeaderList />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Alice/)).toBeInTheDocument();
  });

  it('creates leader', async () => {
    api.getLeaders.mockResolvedValueOnce([]);
    api.createLeader.mockResolvedValue({});
    api.getLeaders.mockResolvedValueOnce([{ id: 2, name: 'Bob', email: 'b@example.com' }]);
    render(
      <MemoryRouter>
        <LeaderList />
      </MemoryRouter>
    );
    await screen.findByText('Add');
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'b@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(api.createLeader).toHaveBeenCalled());
  });
});
