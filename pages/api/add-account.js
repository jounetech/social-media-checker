import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak didukung' });
  }

  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username diperlukan' });
  }

  const filePath = path.join(process.cwd(), 'data/accounts.json');
  const accounts = JSON.parse(fs.readFileSync(filePath));

  if (accounts.includes(username)) {
    return res.status(400).json({ error: 'Username sudah ada' });
  }

  accounts.push(username);
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
  res.status(200).json({ success: true });
}