import express from "express";
import dotenv from "dotenv";


import cors from "cors";


dotenv.config();
const port = 3000;


app.use(express.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} bb adresinde çalışıyor`);
});
