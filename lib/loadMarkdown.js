import { readFile } from "fs/promises";
import path from "path";

export const loadMarkdown = async (relativePath) => {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    return await readFile(fullPath, "utf8");
  } catch {
    return "# Documentation\n\nDocumentation is unavailable.";
  }
};
