import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

class FileController {
  async addNew(req, res) {
    const { filename } = req.params;
    const filePath = `${process.env.DATA_DIRECTORY}/${filename}.json`;
    const jsonData = req.body;
    try {
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        return res.status(400).json({ error: "File already exists" });
      }

      await fs.writeFile(filePath, JSON.stringify(jsonData));
      res.status(201).json({ message: "File created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error creating file" });
    }
  }

  async getAll(req, res) {
    try {
      const files = await fs.readdir(process.env.DATA_DIRECTORY);
      res.json({ files });
    } catch (err) {
      res.status(500).json({ error: "Error retrieving files" });
    }
  }

  async getOne(req, res) {
    const { filename } = req.params;
    const filePath = `${process.env.DATA_DIRECTORY}/${filename}.json`;

    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      const jsonData = JSON.parse(fileData);
      res.json(jsonData);
    } catch (err) {
      res.status(500).json({ error: "Error retrieving file content" });
    }
  }

  async updateOne(req, res) {
    const { filename } = req.params;
    const filePath = `${process.env.DATA_DIRECTORY}/${filename}.json`;
    const jsonData = req.body;

    try {
      await fs.writeFile(filePath, JSON.stringify(jsonData));
      res.json({ message: "File updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error updating file" });
    }
  }

  async deleteOne(req, res) {
    const { filename } = req.params;
    const filePath = `${process.env.DATA_DIRECTORY}/${filename}.json`;

    try {
      await fs.unlink(filePath);
      res.json({ message: "File deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting file" });
    }
  }
}

export default new FileController();
