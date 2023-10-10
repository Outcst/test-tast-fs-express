import dotenv from "dotenv";
import { Router, Request, Response } from "express";
import fs from "fs/promises";

import { createOrUpdateFile, deleteFile, getFile, getFiles, isFileExists } from "../libs/files.service";

dotenv.config();

export const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const files = await getFiles();
    res.json(files);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = `${process.env.DATA_DIRECTORY}/${filename}`;
  const ifExist = await isFileExists(filePath)

  if (!ifExist) {
    res.status(400).json({ error: "File not found" })
    return;
  }
  try {
    const file = await getFile(filePath);
    res.json(file)
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:filename", async (req: Request, res: Response) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({ error: "Only JSON content is allowed" });
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: "It should not be empty" });
    return;
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "It should not be empty" });
    return;
  }
  const { filename } = req.params;
  const filePath = `${process.env.DATA_DIRECTORY}/${filename}`;
  const ifExist = await isFileExists(filePath)

  if (ifExist) {
    res.status(400).json({ error: "File already exists" })
    return;
  }

  try {
    await createOrUpdateFile(filePath, req.body);
    res.status(201).json({ message: "File created successfully" });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ error: "File already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:filename", async (req: Request, res: Response) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({ error: "Only JSON content is allowed" });
    return;
  }
  if (!req.body) {
    res.status(400).json({ error: "It should not be empty" });
    return;
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "It should not be empty" });
    return;
  }
  const { filename } = req.params;
  const filePath = `${process.env.DATA_DIRECTORY}/${filename}`;
  const ifExist = await isFileExists(filePath)

  if (!ifExist) {
    res.status(400).json({ error: "File not found" })
    return;
  }

  try {
    await createOrUpdateFile(filePath, req.body);
    res.json({ message: "File updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = `${process.env.DATA_DIRECTORY}/${filename}`;

  const ifExist = await isFileExists(filePath)
  if (!ifExist) {
    res.status(400).json({ error: "File not found" })
    return;
  }

  try {
    await deleteFile(filePath);
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: "Internal server error" });
  }
});

export { router as fileRouter };
