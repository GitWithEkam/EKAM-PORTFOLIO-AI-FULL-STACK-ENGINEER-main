'use client';

import { useState } from 'react';

function toCSV(rows, cols) {
  const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const head = cols.map(esc).join(',');
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n');
  return head + '\n' + body;
}

function download(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Table({ title, rows, cols, filename }) {
  return (
    <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title} <span className="text-sm font-normal text-white/50">({rows.length})</span></h3>
        <button onClick={() => download(filename, toCSV(rows, cols))}
          className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-orange-400">
          Export CSV (opens in Google Sheets)
        </button>
      </div>
      <div className="max-h-80 overflow-auto rounded-lg border border-white/5">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[#11131c] text-white/60">
            <tr>{cols.map((c) => <th key={c} className="whitespace-nowrap px-3 py-2 font-medium">{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={cols.length} className="px-3 py-4 text-white/40">No records yet.</td></tr>
            ) : rows.map((r, i) => (
              <tr key={i} className="border-t border-white/5">
                {cols.map((c) => <td key={c} className="max-w-xs truncate px-3 py-2 text-white/80">{String(r[c] == null ? '' : r[c])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [pw, setPw] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const unlock = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?key=' + encodeURIComponent(pw));
      if (!res.ok) { setError('Wrong password.'); setData(null); }
      else setData(await res.json());
    } catch (err) { setError('Failed to load.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070A14] px-5 py-10 text-white" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Portfolio Admin <span className="text-orange-400">Dashboard</span></h1>
        <p className="mt-1 text-white/60">Private view of all visitor data — contacts, phone-number leads & traffic.</p>

        {!data ? (
          <form onSubmit={unlock} className="mt-8 flex max-w-sm gap-2">
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password"
              className="flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 outline-none" />
            <button type="submit" disabled={loading} className="rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-black hover:bg-orange-400">
              {loading ? '...' : 'Unlock'}
            </button>
          </form>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[{ l: 'Total Visitors', v: data.visits }, { l: 'Contact Messages', v: data.contacts.length }, { l: 'Phone Leads', v: data.leads.length }, { l: 'Chat Messages', v: data.chats.length }].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-3xl font-bold text-orange-400">{s.v}</div>
                  <div className="mt-1 text-sm text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Table title="Contact Messages" rows={data.contacts} cols={['ts', 'name', 'email', 'message']} filename="contact_messages.csv" />
              <Table title="Phone-Number Leads" rows={data.leads} cols={['ts', 'type', 'name', 'email', 'message']} filename="leads.csv" />
              <Table title="Chatbot Messages" rows={data.chats} cols={['ts', 'sessionId', 'role', 'content']} filename="chat_messages.csv" />
            </div>
          </>
        )}
        {error && <p className="mt-3 text-red-400">{error}</p>}
      </div>
    </div>
  );
}
