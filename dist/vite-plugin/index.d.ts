/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { Plugin } from 'vite';

/** * ***Options for configuring the Rzl Ziggy Route plugin.*** */
type Config = {
    /** Whether to use `sail` instead of the `php` command, defaultValue: `false`.
     *
     * @default false
     */
    sail?: boolean;
    /** Route group to generate, defaultValue: `undefined`.
     *
     * @default undefined
     */
    group?: string;
    /** Application URL, defaultValue: `undefined`.
     *
     * @default undefined
     */
    url?: string;
    /** Generate TypeScript declaration file, defaultValue: `true`.
     *
     * @default true
     */
    types?: boolean;
    /** Generate only the TypeScript declaration file, defaultValue: `false`.
     *
     * @default false
     */
    typesOnly?: boolean;
    /** Route name patterns to include, defaultValue: `[]`.
     *
     * @default []
     */
    only?: string[];
    /** Route name patterns to exclude, defaultValue: `[]`.
     *
     * @default []
     */
    except?: string[];
    /** Delay before running the generating is executed (in ms), defaultValue: `250`.
     *
     * @default 250
     */
    delay?: number | undefined;
    /** Delay before running the generating can be executed again (in ms), defaultValue: `250`.
     *
     * @default 250
     */
    throttle?: number | undefined;
};

/**
 * ---------------------------------------------------------
 * * ***Vite Plugin: `rzlZiggyVitePlugin`.***
 * ---------------------------------------------------------
 * Generates Laravel `Ziggy Route` for JavaScript/TypeScript route files,
 * watches Laravel route/config changes during development, and triggers
 * automatic regeneration with throttling/delay controls.
 *
 * - **This plugin is designed for full compatibility with:**
 *    - **Laravel routes → JS/TS client route generator**
 *    - **Dynamic rebuild on file changes**
 *    - **Strict runtime validation for config options**
 *
 * - **Key Features:**
 *    - Auto-generates fresh route files using an internal `build()` command.
 *    - Watches `routes/**\/*.php`, `config/rzl-ziggy.php`, and `.env*` files.
 *    - Provides configurable `delay`, `throttle`, `except`, `only`, `group`, and `url`.
 *    - Supports Ziggy `types` / `typesOnly` to export TS types only.
 *    - Prints clean, colorized console logs when regeneration is triggered.
 *    - Full runtime validation with detailed error messages.
 *
 * @param config - Optional configuration object to customize plugin behavior, see {@link Config | `Config` }.
 *
 * @returns
 * A Vite plugin object with:
 * - `name`: Plugin identifier.
 * - `configResolved`: Hook to access resolved Vite config.
 * - `handleHotUpdate`: Hook to react to file changes and trigger rebuilds.
 *
 * @throws
 * - `TypeError` if any config property has the wrong type.
 * - Detailed runtime validation errors for:
 *   - non-integer `delay` / `throttle`
 *   - non-string entries inside `except` / `only`
 *   - invalid `boolean` flags (`sail`, `types`, etc.)
 *   - invalid `url` or `group` types
 *
 * @example
 * ```ts
 * import rzlZiggyVitePlugin from "@rzl-zone/ziggy-route/vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [
 *     rzlZiggyVitePlugin({
 *       delay: 200,
 *       throttle: 300,
 *       only: ["web.*"],
 *       types: true
 *     })
 *   ]
 * });
 * ```
 *
 * @example
 * ```ts
 * // Error case: invalid "except" values
 * rzlZiggyVitePlugin({
 *   except: ["admin.*", 123]
 * });
 * // ❌ Throws:
 * // TypeError: "Parameter `except` property of the `config` (first parameter) must be of type `array-of-string` and contains `string` (non empty-string) only, invalid values: `number`: `123`"
 * ```
 *
 * @remarks
 * - In development, this plugin logs a full stack trace for errors.
 * - In production, stack traces are suppressed for cleaner output.
 * - This plugin integrates tightly with Laravel route structure and assumes
 *   the project has a valid `composer.json` + Ziggy Route config files.
 */
declare const rzlZiggyVitePlugin: (config?: Config) => Plugin;

export { rzlZiggyVitePlugin as default };
