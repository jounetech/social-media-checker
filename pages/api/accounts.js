import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/accounts.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const data = fs.readFileSync(filePath);
    const accounts = JSON.parse(data);
    res.status(200).json(accounts);
  } else if (req.method === 'POST') {
    const { username } = req.body;
    const data = fs.readFileSync(filePath);
    const accounts = JSON.parse(data);
    if (!accounts.includes(username)) {
      accounts.push(username);
      fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
    }
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}