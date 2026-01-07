import React, { useEffect, useState } from 'react';
import { getTasksForMaster, createTaskForMaster, deleteTask, updateTask, updateMaster } from '../api';
import TaskForm from './TaskForm';

export default function MasterDetails({ master, onChange, config }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // local editable fio value
  const [editing, setEditing] = useState(false);
  const [fioValue, setFioValue] = useState(master?.fio || '');

  useEffect(() => {
    setFioValue(master?.fio || '');
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [master]);

  async function loadTasks() {
    setLoading(true);
    const t = await getTasksForMaster(master._id);
    setTasks(t || []);
    setLoading(false);
  }

  function sumComplexity() { return tasks.reduce((s, t) => s + t.complexity, 0); }

  async function addTask(address, complexity) {
    const current = sumComplexity();
    if (current + complexity > config.complexityLimit) return alert(`Невозможно назначить: превышен лимит (${config.complexityLimit})`);
    const res = await createTaskForMaster(master._id, address, complexity);
    if (res.error) return alert(res.message || JSON.stringify(res));
    await loadTasks(); if (onChange) onChange();
  }

  async function removeTask(id) { if (!confirm('Удалить заявку?')) return; await deleteTask(id); await loadTasks(); if (onChange) onChange(); }

  async function reassignTask(taskId) {
    const newMasterId = prompt('Введите ID мастера, которому передать заявку:');
    if (!newMasterId) return;
    const res = await updateTask(taskId, { masterId: newMasterId });
    if (res.error) return alert(res.message || JSON.stringify(res));
    await loadTasks(); if (onChange) onChange();
  }

  async function saveFio() {
    const newFio = fioValue?.trim();
    if (!newFio) return alert('ФИО не может быть пустым');
    // call API
    const res = await updateMaster(master._id, newFio);
    if (res && res.error) {
      alert(res.message || 'Ошибка при обновлении мастера');
      return;
    }
    // success: stop editing, notify parent to reload lists
    setEditing(false);
    if (onChange) onChange();
  }

  function cancelEdit() {
    setFioValue(master.fio);
    setEditing(false);
  }

  return (
    <div className="details-root">
      <div className="details-header card">
        <div>
          {editing ? (
            <>
              <input
                value={fioValue}
                onChange={e => setFioValue(e.target.value)}
                style={{ fontSize: 22, fontWeight: 700, padding: '6px 8px', borderRadius: 8, border: '1px solid #e6eef7' }}
              />
              <div className="mono id" style={{ marginTop: 6 }}>ID: {master._id}</div>
            </>
          ) : (
            <>
              <h2 className="fio-large">{master.fio}</h2>
              <div className="mono id">ID: {master._id}</div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="load">
            <div className="label">Нагрузка</div>
            <div className="badge">{sumComplexity()} / {config.complexityLimit}</div>
          </div>

          {editing ? (
            <>
              <button className="btn primary" onClick={saveFio}>Сохранить</button>
              <button className="btn" onClick={cancelEdit}>Отмена</button>
            </>
          ) : (
            <button className="btn" onClick={() => setEditing(true)}>Ред.</button>
          )}
        </div>
      </div>

      <TaskForm onAdd={addTask} complexityLevels={config.complexityLevels} />

      <div className="card tasks-card">
        <div className="card-head">Заявки <span className="muted">({tasks.length})</span></div>
        {loading ? <div className="muted">Загрузка...</div> : (
          <table className="tasks-table">
            <thead><tr><th>Адрес</th><th>Сложность</th><th>ID</th><th>Действия</th></tr></thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t._id}>
                  <td>{t.address}</td>
                  <td>{t.complexity}</td>
                  <td className="mono smallid">{t._id}</td>
                  <td>
                    <button className="btn" onClick={() => removeTask(t._id)}>Удалить</button>
                    <button className="btn" onClick={() => reassignTask(t._id)}>Передать</button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && <tr><td colSpan="4" className="empty">У этого мастера нет заявок</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
