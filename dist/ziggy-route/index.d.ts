/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.12.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
import { R as Router, V as ValidRouteName, a as RouteParams, C as Config, P as ParameterValueProps } from '../index-BWEFzAgA.js';
export { K as KnownRouteName, c as ParameterValue, d as ParsedQs, e as RawParameterValue, f as RouteDefinition, g as RouteFactoryConfig, h as RouteList, i as RouteName, b as RouterConfig, T as TypeConfig } from '../index-BWEFzAgA.js';

/** -------------------------------------------------------
 * * ***The `route()` function of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [**`route()` helper**](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with just configuration, it returns a `Router` instance using that config.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array` or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config]
 * Optional route configuration object.
 * - Required only if the global `appRoutes` variable is not available, by default the function will
 *   use the global `appRoutes` if present.
 * @returns {string | Router} A generated URL string or a `Router` instance, depend of `name` argument.
 *
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
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#route-function)
 */
declare function route(): Router;
/** -------------------------------------------------------
 * * ***The `route()` function of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [**`route()` helper**](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with just configuration, it returns a `Router` instance using that config.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {RouteParams<T> | null | undefined} [params] - Route parameters (either an `object`, `array` or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config]
 * Optional route configuration object.
 * - Required only if the global `appRoutes` variable is not available, by default the function will use
 *   the global `appRoutes` if present.
 * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#route-function)
 */
declare function route<T extends ValidRouteName>(name: T, params?: RouteParams<T> | null | undefined, absolute?: boolean, config?: Config): string;
/** -------------------------------------------------------
 * * ***The `route()` function of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [**`route()` helper**](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with just configuration, it returns a `Router` instance using that config.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (e.g., `"posts.show"`), defaultValue is `undefined`.
 * @param {ParameterValueProps | null | undefined} [params] - Route parameters (either an `object`, `array`, or `null` value), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config]
 * Optional route configuration object.
 *  - Required only if the global `appRoutes` variable is not available, by default, the function will use
 *    the global `appRoutes` if present.
 * @returns {string} Return `string` cause argument `name` is not `null` or `undefined`.
 * @example
 * // Returns something like "/posts/123"
 * route("posts.show", { id: 123 });
 *
 * @example
 * // Returns absolute URL like "https://example.com/posts/123"
 * route("posts.show", { id: 123 }, true);
 *
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#route-function)
 */
declare function route<T extends ValidRouteName>(name: T, params?: ParameterValueProps | null | undefined, absolute?: boolean, config?: Config): string;
/** -------------------------------------------------------
 * * ***The `route()` function of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **This function works similarly to Laravel's [**`route()` helper**](https://laravel.com/docs/helpers#method-route).**
 * @description
 * You can pass it the name of a route and any required parameters, and it will generate a proper URL string.
 * - **Behavior:**
 *    - If called with no arguments, it returns a `Router` instance for more advanced usage.
 *    - If called with just configuration, it returns a `Router` instance using that config.
 *    - If called with a route name and optional parameters, it returns a full URL string.
 * @template T - A valid route name (based on your `appRoutes` route definitions).
 * @param {T} [name] - The name of the route (is `null` or `undefined`), defaultValue is `undefined`.
 * @param {null | undefined} [params] - Route parameters (because argument `name` is `undefined` or `null`, so argument params only can accept `undefined`), defaultValue is `undefined`.
 * @param {boolean} [absolute=false] - Whether to return an absolute URL (includes scheme and host), defaultValue is `false`.
 * @param {Config} [config]
 * Optional route configuration object.
 *  - Required only if the global `appRoutes` variable is not available, by default, the function will use
 *    the global `appRoutes` if present.
 * @returns {Router} Return `Router` instance cause argument name is `null` or `undefined`.
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
 * @see [**More Docs see: `route()` function.**](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#route-function)
 */
declare function route(name: null | undefined, params?: null | undefined, absolute?: boolean, config?: Config): Router;

export { Config, ParameterValueProps, RouteParams, Router, ValidRouteName, route };
