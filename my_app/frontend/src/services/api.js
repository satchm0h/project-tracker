const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  let data = null;
  try {
    if (response.status !== 204) {
      data = await response.json();
    }
  } catch (_) {
    // ignore JSON parse errors
  }
  if (!response.ok) {
    const message = data && data.error ? data.error : response.statusText;
    throw new Error(message);
  }
  return data;
}

export function getProjects() {
  return request('/projects');
}

export function getProject(id) {
  return request(`/projects/${id}`);
}

export function createProject(project) {
  return request('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
}

export function updateProject(id, project) {
  return request(`/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' });
}

export function getLeaders() {
  return request('/leaders');
}

export function createLeader(leader) {
  return request('/leaders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leader),
  });
}

export function deleteLeader(id) {
  return request(`/leaders/${id}`, { method: 'DELETE' });
}
