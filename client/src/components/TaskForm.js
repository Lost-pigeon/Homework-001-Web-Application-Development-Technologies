import React, { useState } from 'react';

export default function TaskForm({ onAdd, complexityLevels }) {
  const [address, setAddress] = useState('');
  const [complexity, setComplexity] = useState(complexityLevels.length ? complexityLevels[0].value : 1);

  async function submit(e) {
    e.preventDefault();
    if (!address.trim()) return alert('Введите адрес');
    await onAdd(address.trim(), Number(complexity));
    setAddress('');
  }

  return (
    <form className="card task-form" onSubmit={submit}>
      <div className="form-row">
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Адрес" />
        <select value={complexity} onChange={e => setComplexity(e.target.value)}>
          {complexityLevels.map(l => <option key={l.value} value={l.value}>{l.label} ({l.value})</option>)}
        </select>
        <button className="btn primary" type="submit">Добавить заявку</button>
      </div>
    </form>
  );
}