import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";


dotenv.config();
const { PORT } = process.env;
const app = express();

app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json());
app.use(cors());
const server = app.listen(PORT, async () => {
  console.log(`Uygulama http://localhost:${PORT} çalışıyor  `);


});
