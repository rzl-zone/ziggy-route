import fs from "fs";
import fg from "fast-glob";
import { topBanner } from "./constants/banner";
import { BUILD_LOGGER } from "./utils/logger";

export const injectBanner = async (pattern: string | string[]) => {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns.sort()) {
      const matched = fg.sync(p, { absolute: false });
      files.push(...matched);
    }

    BUILD_LOGGER.ON_STARTING({
      actionName: "Injecting Banner"
    });

    let injectedCount = 0;

    for (const filePath of files.sort()) {
      if (!fs.existsSync(filePath)) continue;

      const content = (await fs.promises.readFile(filePath, "utf8")).trimStart();
      const trimmed = content.trim();

      if (!trimmed || trimmed === '"use strict";' || trimmed === "'use strict';")
        continue;
      if (content.startsWith(topBanner)) continue;

      const finalContent = `${
        typeof topBanner === "string" && topBanner.trim().length ? topBanner + "\n" : ""
      }${content}`;
      await fs.promises.writeFile(filePath, finalContent, "utf8");

      injectedCount++;

      BUILD_LOGGER.ON_PROCESS({
        actionName: "Banner Injected",
        textDirectFolder: "to",
        count: injectedCount,
        nameDirect: filePath
      });
    }

    if (injectedCount > 0) {
      BUILD_LOGGER.ON_FINISH({
        actionName: "Injecting Banner",
        count: injectedCount
      });
    } else {
      BUILD_LOGGER.ON_SKIPPING({
        actionName: "Injecting Banner",
        reasonEndText: "injecting"
      });
    }
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "Injecting Banner",
      error
    });
  }
};

await injectBanner([
  "dist/**/*.{js,cjs,mjs,esm}",
  "dist/**/*.{ts,cts,mts,esm}",
  "dist/**/*.d.{ts,cts,mts,esm}"
]);
