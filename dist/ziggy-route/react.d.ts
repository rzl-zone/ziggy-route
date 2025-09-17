import{R as Router,V as ValidRouteName,a as RouteParams,P as ParameterValueProps,C as Config}from'../index-B8x4plc9.js';type ReactRouteHook={
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` from `useRouter` helper.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * - **⚠️ Note:**
 *    - Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
 *      because the route configuration is already provided by `useRouter()`.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array`, or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @returns {string | Router} A generated URL string or a `Router` instance, depend of `name` argument.
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route();
 * console.log(r) // ➔ r instance of Router.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined);
 * console.log(r) // ➔ r instance of Router.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined, undefined, true, JSON.parse(appRoutes));
 * console.log(r) // ➔ r instance of Router.
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
():Router;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` from `useRouter` helper.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * - **⚠️ Note:**
 *    - Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
 *      because the route configuration is already provided by `useRouter()`.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | null | undefined} [params] - Route parameters (either an `object`, `array`, or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
<T extends ValidRouteName>(name:T,params?:RouteParams<T>|null|undefined,absolute?:boolean):string;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` from `useRouter` helper.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * - **⚠️ Note:**
 *    - Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
 *      because the route configuration is already provided by `useRouter()`.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array`, or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`
 * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
<T extends ValidRouteName>(name:T,params?:ParameterValueProps|null|undefined,absolute?:boolean):string;
/** -------------------------------------------------------
 * * ***Rzl Ziggy's `route()` from `useRouter` helper.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [`route()` helper](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * - **⚠️ Note:**
 *    - Unlike the standalone `route()` helper, this version does **not** require a `config` parameter,
 *      because the route configuration is already provided by `useRouter()`.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (is `null` or `undefined`), defaultValue is `undefined`.
 * @param {null | undefined} [params] - Route parameters (because argument `name` is `undefined` or `null`, so argument params only can accept `undefined`), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @returns {Router} Return `Router` instance cause argument name is `null` or `undefined`.
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined);
 * console.log(r) // ➔ r instance of Router.
 *
 *
 * @example
 * // Returns Router instance like route().has(...) or router().current() ...
 * const r = route(undefined, undefined, true, JSON.parse(appRoutes));
 * console.log(r) // ➔ r instance of Router.
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-app/ziggy?tab=readme-ov-file#route-function)
 */
(name:undefined|null,params?:undefined|null,absolute?:boolean):Router;};
/** -------------------------------------------------------
 * * ***Rzl Ziggy's React Hook Helper.***
 * -------------------------------------------------------
 * **Rzl Ziggy includes a `useRoute()` hook to make it easy to use
 * the `route()` helper in your React app.**
 *
 * @param {Config} [defaultConfig]
 * Optional route configuration object.
 * - Required only if the global `appRoutes` variable is not available, by default
 * the function will use the global `appRoutes` if present.
 *
 * @see [**More docs use with react hook: `useRoute`.**](https://github.com/rzl-app/ziggy?tab=readme-ov-file#react)
 */
declare function useRoute(defaultConfig?:Config):ReactRouteHook;export{type ReactRouteHook,useRoute};
