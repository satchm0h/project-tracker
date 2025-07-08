import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeaderList from '../LeaderList';
import * as api from '../services/api';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock useNavigate
const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../services/api');

describe('LeaderList', () => {
  beforeEach(() => {
    api.getLeaders.mockReset();
    api.createLeader.mockReset();
    navigate.mockReset();
  });

  it('renders leaders from API', async () => {
    api.getLeaders.mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@example.com' }]);
    render(
      <ThemeProvider>
        <MemoryRouter>
          <LeaderList />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(await screen.findByText(/Alice/)).toBeInTheDocument();
  });

  it('navigates to new leader form when Add Leader is clicked', async () => {
    api.getLeaders.mockResolvedValue([]);
    render(
      <ThemeProvider>
        <MemoryRouter>
          <LeaderList />
        </MemoryRouter>
      </ThemeProvider>
    );
    
    // Wait for the component to load and find the Add Leader button
    const addButton = await screen.findByText('Add Leader');
    fireEvent.click(addButton);
    
    // Check that navigation was called with the correct path
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/leaders/new'));
  });
});
