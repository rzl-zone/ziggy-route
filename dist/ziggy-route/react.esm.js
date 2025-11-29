/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.15.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { RouterConfigError, route } from '../chunk-FY7J5NOI.esm.js';
import '../chunk-IWMGSFDN.esm.js';

function useRoute(defaultConfig) {
  if (!defaultConfig && !globalThis.appRoutes && typeof appRoutes === "undefined") {
    throw new RouterConfigError(
      `Hook \`useRouter()\` missing configuration.
- Ensure that a \`appRoutes\` variable is defined globally or pass a config object into the \`useRoute\` hook.`
    );
  }
  return (name, params, absolute) => route(name, params, absolute, defaultConfig);
}

export { useRoute };
