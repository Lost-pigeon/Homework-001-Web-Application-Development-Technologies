import React, { useState } from 'react';
import { createMaster } from '../api';

export default function MasterForm({ onCreated }) {
  const [fio, setFio] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e?.preventDefault?.();
    if (!fio.trim()) return alert('Введите ФИО');
    setLoading(true);
    const res = await createMaster(fio.trim());
    setLoading(false);
    if (res && res._id) {
      setFio('');
      if (onCreated) onCreated();
    } else {
      alert(res?.error || 'Ошибка создания мастера');
    }
  }

  return (
    <form className="card small-form" onSubmit={submit}>
      <div className="form-row">
        <input placeholder="ФИО" value={fio} onChange={e => setFio(e.target.value)} />
        <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Добавление...' : 'Добавить'}</button>
      </div>
    </form>
  );
}