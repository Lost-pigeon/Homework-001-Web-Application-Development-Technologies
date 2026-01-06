import React from 'react';
import { deleteMaster } from '../api';

export default function MastersList({ masters, onSelect, onDeleted }) {
  async function del(id) {
    if (!confirm('Удалить мастера?')) return;
    await deleteMaster(id);
    if (onDeleted) onDeleted();
  }

  return (
    <div className="masters-card card">
      <div className="card-head">Мастера <span className="muted">({masters.length})</span></div>
      <ul className="masters-list">
        {masters.map(m => (
          <li key={m._id} className="master-item">
            <div className="master-info">
              <div className="avatar" aria-hidden>{m.fio.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <div>
                <div className="fio">{m.fio}</div>
                <div className="mono id">{m._id}</div>
              </div>
            </div>
            <div className="master-actions">
              <button className="btn" onClick={() => onSelect(m)}>Открыть</button>
              <button className="btn danger" onClick={() => del(m._id)}>Удалить</button>
            </div>
          </li>
        ))}
        {masters.length === 0 && <li className="empty">Мастера не найдены</li>}
      </ul>
    </div>
  );
}