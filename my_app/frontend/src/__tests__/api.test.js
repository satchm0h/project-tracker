import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProjects, createProject } from '../services/api';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe('api service', () => {
  it('getProjects requests /api/projects', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    const data = await getProjects();
    expect(fetch).toHaveBeenCalledWith('/api/projects', {});
    expect(data).toEqual([]);
  });

  it('createProject posts data', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 1 }) });
    const project = { name: 'Test' };
    await createProject(project);
    expect(fetch).toHaveBeenCalledWith('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
  });

  it('throws on error status', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: 'fail' }),
    });
    await expect(getProjects()).rejects.toThrow('fail');
  });
});
