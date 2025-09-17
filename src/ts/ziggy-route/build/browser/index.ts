import { CONFIG } from "@ts/utils/constants";
import { route } from "@ts/ziggy-route/main/route";
import { isUndefined } from "@rzl-zone/utils-js/predicates";

if (!isUndefined(globalThis.route)) {
  const { PACKAGE } = CONFIG;

  console.warn(
    `[${PACKAGE.PREFIX.NAME}] WARNING:\n- Detected existing global \`route\`.\n- It will be overridden by "${PACKAGE.NPM_NAME}" route implementation.`
  );
}

globalThis.route = route;
