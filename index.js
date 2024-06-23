import express from 'express';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Basit bir GET isteği
app.get('/', (req, res) => {
  res.send('Merhaba Dünya!');
});

// Basit bir API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'API çalışıyor!' });
});

// Dinleme
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
