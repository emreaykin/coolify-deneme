import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;


// Middleware
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());
app.use(cors());

// Basit bir GET isteği
app.get('/', (req, res) => {
  res.send('Merhaba Dünya!');
});

// Basit bir API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'API çalışıyor! ' });
});
app.get('/apii', (req, res) => {
    res.json({ message: 'API kanca deneme ' });
  });
  app.get('/web', (req, res) => {
    res.json({ message: 'kanca' });
  });
// Dinleme
const server =app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} bbbb adresinde çalışıyor`);
});
