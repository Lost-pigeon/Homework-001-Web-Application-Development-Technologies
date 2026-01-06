import React, { useEffect, useState } from 'react';
import { fetchConfig, getMasters } from './api';
import MasterForm from './components/MasterForm';
import MastersList from './components/MastersList';
import MasterDetails from './components/MasterDetails';

export default function App() {
  const [masters, setMasters] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [config, setConfig] = useState({ complexityLevels: [], complexityLimit: 10 });
  const [q, setQ] = useState('');

  async function load() {
    try {
      const cfg = await fetchConfig();
      setConfig(cfg);
      const m = await getMasters();
      setMasters(m || []);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { load(); }, []);

  const filtered = masters.filter(m => m.fio.toLowerCase().includes(q.toLowerCase()) || m._id.includes(q));

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div>
            <div className="title">IP Manager</div>
            <div className="subtitle">Распределение заявок — менеджер</div>
          </div>
        </div>
        <div className="header-actions">
          <div className="search">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск по ФИО или ID" />
          </div>
        </div>
      </header>

      <main className="main-grid">
        <aside className="sidebar">
          <div className="sidebar-top">
            <MasterForm onCreated={load} />
          </div>
          <div className="sidebar-list">
            <MastersList masters={filtered} onSelect={m => setSelectedMaster(m)} onDeleted={load} />
          </div>
        </aside>

        <section className="panel">
          {selectedMaster ? (
            <MasterDetails master={selectedMaster} onChange={load} config={config} />
          ) : (
            <div className="panel-empty">
              <h2>Выберите мастера</h2>
              <p>Нажмите «Открыть» в списке слева, чтобы просмотреть заявки и управление.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div>COMPLEXITY LIMIT — {config.complexityLimit}</div>
        <div>Сервер: <span className="mono">{process.env.REACT_APP_API_BASE || 'http://localhost:4000/api'}</span></div>
      </footer>
    </div>
  );
}