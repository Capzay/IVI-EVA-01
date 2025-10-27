import { Client, TextChannel } from "discord.js";
import { getEnvVariable } from "../util/getEnvVar";
import { ErrorEmbed } from "../embeds/Errors";

export function HandleError(error: Error, client: Client) {
  const errorChannel = client.channels.cache.get(
    getEnvVariable("ERROR_LOG_CHANNEL")
  ) as TextChannel;
  if (!errorChannel) return;

  const fileMatches = error.stack?.match(/\((.*):\d+:\d+\)/g);
  if (fileMatches) {
    const fileInfo = fileMatches
      .map((match) => {
        // Extract everything between parentheses: (filepath:line:column)
        const pathMatch = match.match(/\((.*):\d+:\d+\)/);
        if (pathMatch) {
          // Get the full match including line:column numbers
          const fullPath = match.match(/\((.*):\d+:\d+\)/)?.[0];
          if (fullPath) {
            // Extract just the content inside parentheses: filepath:line:column
            const content = fullPath.slice(1, -1); // Remove ( and )

            // Now extract filepath and line number
            // Use a more specific regex that matches the last :number:number pattern
            // This handles cases like C:\path\file.ts:33:13 correctly
            const fileLineMatch = content.match(/^(.+):(\d+):(\d+)$/);
            if (fileLineMatch) {
              const filePath = fileLineMatch[1];
              const lineNumber = fileLineMatch[2];
              const columnNumber = fileLineMatch[3];
              return `${filePath}:${lineNumber}:${columnNumber}`;
            }
          }
          return pathMatch[1]; // fallback
        }
        return "";
      })
      .filter((fileInfo) => fileInfo !== "");

    // Filter for TypeScript files not in node_modules
    const tsFiles = fileInfo.filter((fileInfo) => {
      // For filtering, extract just the file path to check file type and location
      // But keep the original fileInfo (with line number) in the result
      let filePath = fileInfo;

      // Check if this looks like a file path with line number at the end
      // Pattern: ends with :number (the line number we added)
      const lineNumberMatch = fileInfo.match(/^(.+):(\d+)$/);
      if (lineNumberMatch) {
        filePath = lineNumberMatch[1]; // Everything before the line number for filtering
      }

      const isTypeScript = filePath.endsWith(".ts");
      const notInNodeModules = !filePath.includes("node_modules");

      return isTypeScript && notInNodeModules;
      // Note: we return true/false for filtering, but the original fileInfo (with line number) is kept
    });

    // Use filtered TypeScript files if any exist, otherwise use all files
    const finalFileInfo = tsFiles.length > 0 ? tsFiles : fileInfo;

    const errorEmbed = ErrorEmbed(
      error.name,
      error.message,
      finalFileInfo.join("\n")
    );
    return errorChannel.send({ embeds: [errorEmbed] });
  }

  const errorEmbed = ErrorEmbed(
    error.name,
    error.message,
    error.stack || "No stack trace available"
  );
  return errorChannel.send({ embeds: [errorEmbed] });
}
