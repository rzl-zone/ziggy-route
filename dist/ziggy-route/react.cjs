/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
'use strict';

var chunk7LH2HYNO_cjs = require('../chunk-7LH2HYNO.cjs');
require('../chunk-4M7PUXSA.cjs');

function useRoute(defaultConfig) {
  if (!defaultConfig && !globalThis.appRoutes && typeof appRoutes === "undefined") {
    throw new chunk7LH2HYNO_cjs.RouterConfigError(
      `Hook \`useRouter()\` missing configuration.
- Ensure that a \`appRoutes\` variable is defined globally or pass a config object into the \`useRoute\` hook.`
    );
  }
  return (name, params, absolute) => chunk7LH2HYNO_cjs.route(name, params, absolute, defaultConfig);
}

exports.useRoute = useRoute;
