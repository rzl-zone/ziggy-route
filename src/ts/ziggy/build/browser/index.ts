import { isUndefined } from "@rzl-zone/utils-js";
import { route } from "@/main/route";
import { CONFIG } from "@ts/utils/constants";

if (!isUndefined(globalThis.route)) {
  const { PACKAGE } = CONFIG;

  console.warn(
    `[${PACKAGE.PREFIX.NAME}]: ⚠️ Detected existing global \`route\`. It will be overridden by '${PACKAGE.NPM_NAME}' route implementation.`
  );
}

globalThis.route = route;
