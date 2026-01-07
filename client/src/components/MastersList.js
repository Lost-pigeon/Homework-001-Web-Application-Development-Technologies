import React from 'react';
import { deleteMaster } from '../api';

export default function MastersList({ masters = [], onSelect, onDeleted }) {

  async function handleDelete(id) {
    if (!window.confirm('Удалить мастера?')) return;
    try {
      await deleteMaster(id);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления мастера');
    }
  }

  return (
    <div className="masters-card card" style={{ position: 'relative' }}>
      <div className="card-head">
        <div>Мастера</div>
        <div className="muted" style={{ fontSize: 13 }}>{masters.length}</div>
      </div>

      <ul className="masters-list">
        {masters.length === 0 && <li className="empty">Мастера не найдены</li>}

        {masters.map(m => (
          <li key={m._id} className="master-item">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
              <div className="avatar" aria-hidden>
                {String(m.fio || '–').split(' ').map(n => n[0]).slice(0,2).join('')}
              </div>

              <div className="master-meta">
                <div className="fio">{m.fio}</div>
                <div className="id mono">{m._id}</div>
              </div>
            </div>

            <div className="master-actions">
              <button className="btn open" onClick={() => onSelect && onSelect(m)}>Открыть</button>
              <button className="btn delete" onClick={() => handleDelete(m._id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
