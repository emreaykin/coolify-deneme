import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";


dotenv.config();
const port = 3000;
const app = express();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} aaaa adresinde çalışıyor`);
});
