import fs from "fs/promises";

export const fileExists = async (req, res, next) => {
  const { filename } = req.params;
  const filePath = `${process.env.DATA_DIRECTORY}/${filename}.json`;

  try {
    await fs.access(filePath);
    next();
  } catch (err) {
    res.status(404).json({ error: "File not found" });
  }
};
