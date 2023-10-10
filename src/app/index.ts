import express from "express";
import * as dotenv from "dotenv";

import { fileRouter } from "./files";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/files", fileRouter);

app.listen(PORT, () => console.log("SERVER STARTED"));
