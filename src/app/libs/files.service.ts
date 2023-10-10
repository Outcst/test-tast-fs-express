import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

export const getFiles = async () => {
  const files = await fs.readdir(process.env.DATA_DIRECTORY as string);
  return files;
};

export const getFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, "utf8");
  const jsonContent = JSON.parse(fileContent);
  return jsonContent;
};

export const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath);
}

export const createOrUpdateFile = async (filePath: string, data: string) => {
  await fs.writeFile(filePath, JSON.stringify(data));
  return getFile(filePath);
};

export const isFileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};