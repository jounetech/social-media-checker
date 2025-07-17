import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);

  const handleCheck = async () => {
    const res = await fetch(`/api/check-instagram?username=${username}`);
    const result = await res.json();
    setData(result);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 font-sans">
      <h1 className="text-2xl font-bold mb-4">📱 Social Media Activity Checker</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Masukkan username Instagram (tanpa @)"
          className="p-2 border rounded w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleCheck} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          🔍 Cek Sekarang
        </button>
      </div>
      {data && !data.error && (
        <div className="p-4 border rounded bg-white">
          <p><strong>@{data.username}</strong></p>
          <p>Posting terakhir: {new Date(data.lastPostDate).toLocaleDateString()}</p>
          <p>Status: <strong>{data.status}</strong> (selisih {data.selisihHari} hari)</p>
        </div>
      )}
      {data && data.error && (
        <div className="p-4 border rounded bg-red-100">
          <p>Error: {data.error}</p>
        </div>
      )}
    </div>
  );
}