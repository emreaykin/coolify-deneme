import express from "express";

import bodyParser from "body-parser";
import cors from "cors";


const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} bb adresinde çalışıyor`);
});
