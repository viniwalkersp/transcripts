import { put } from '@vercel/blob';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false, // desativar o bodyParser padrão
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const fileBuffer = await buffer(req);
    const fileName = req.headers['x-filename'] || `file-${Date.now()}.html`;

    const blob = await put(fileName, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Erro ao subir blob:', error);
    res.status(500).json({ error: 'Falha no upload' });
  }
}
