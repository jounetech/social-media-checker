import axios from 'axios';
import cheerio from 'cheerio';
import dayjs from 'dayjs';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const url = `https://www.instagram.com/${username}/`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const sharedDataScript = $('script[type="application/ld+json"]').html();

    if (!sharedDataScript) {
      return res.status(500).json({ error: 'Tidak bisa mengambil data Instagram.' });
    }

    const json = JSON.parse(sharedDataScript);
    const lastPostDate = json.mainEntityofPage.datePublished;

    const selisihHari = dayjs().diff(dayjs(lastPostDate), 'day');
    const status = selisihHari <= 2 ? 'Aktif' : selisihHari === 2 ? 'Warning' : 'Tidak Aktif';

    return res.status(200).json({
      username,
      lastPostDate,
      selisihHari,
      status
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Gagal mengambil data Instagram.' });
  }
}