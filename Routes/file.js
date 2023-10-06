import express from "express";

import fileController from "../Controllers/file.js";
import { fileExists } from "../Middleware/existingFileMiddleware.js";

const router = new express.Router();

router.post("/:filename", fileController.addNew);
router.get("/", fileController.getAll);
router.get("/:filename", fileExists, fileController.getOne);
router.put("/:filename", fileExists, fileController.updateOne);
router.delete("/:filename", fileExists, fileController.deleteOne);

export default router;
