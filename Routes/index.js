import express from "express";

import file from "./file.js";

const router = new express.Router();

router.use("/file", file);

export default router;
