import { useEffect, useState } from 'react';

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(setAccounts);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      Promise.all(
        accounts.map(username =>
          fetch(`/api/check-instagram?username=${username}`).then(res => res.json())
        )
      ).then(setResults);
    }
  }, [accounts]);

  const handleAddAccount = async () => {
    if (!newUsername) return;
    await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername })
    });
    setNewUsername('');
    const updated = await fetch('/api/accounts').then(res => res.json());
    setAccounts(updated);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4">📱 Social Media Activity Checker</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tambahkan username Instagram (tanpa @)"
          className="p-2 border rounded w-full"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleAddAccount} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          ➕ Tambah Akun
        </button>
      </div>

      {results.map((data, index) => (
        <div key={index} className="p-4 mb-4 border rounded bg-white">
          <p><strong>@{data.username}</strong></p>
          {data.error ? (
            <p className="text-red-600">Error: {data.error}</p>
          ) : (
            <>
              <p>Posting terakhir: {new Date(data.lastPostDate).toLocaleDateString()}</p>
              <p>Status: <strong>{data.status}</strong> (selisih {data.selisihHari} hari)</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}