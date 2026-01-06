const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function fetchConfig() {
  const res = await fetch(`${API_BASE.replace('/api','')}/api/config`);
  return res.json();
}
export async function getMasters() { const res = await fetch(`${API_BASE}/masters`); return res.json(); }
export async function createMaster(fio) { const res = await fetch(`${API_BASE}/masters`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fio }) }); return res.json(); }
export async function updateMaster(id, fio) { const res = await fetch(`${API_BASE}/masters/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fio }) }); return res.json(); }
export async function deleteMaster(id) { const res = await fetch(`${API_BASE}/masters/${id}`, { method: 'DELETE' }); return res.json(); }
export async function getTasksForMaster(masterId) { const res = await fetch(`${API_BASE}/masters/${masterId}/tasks`); return res.json(); }
export async function createTaskForMaster(masterId, address, complexity) { const res = await fetch(`${API_BASE}/masters/${masterId}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address, complexity }) }); return res.json(); }
export async function deleteTask(taskId) { const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' }); return res.json(); }
export async function updateTask(taskId, payload) { const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); return res.json(); }
