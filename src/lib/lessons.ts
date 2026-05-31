import fs from "fs";
import path from "path";

/**
 * Loads markdown content from src/data/lessons/
 * Use this in Server Components or API routes.
 */
export async function getLessonContent(phaseId: string, moduleId: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "src/data/lessons", `${phaseId}-${moduleId}.md`);
    
    if (!fs.existsSync(filePath)) {
      return "";
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error loading lesson content for ${phaseId}/${moduleId}:`, error);
    return "";
  }
}
