/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.14.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
/** -------------------------------------------------------
 * * ***A list of routes and their parameters and bindings.***
 * -------------------------------------------------------
 *
 * Extended and filled by the route list generated with `php artisan rzl-ziggy:generate --types`.
 */
interface RouteList {
}
/** -------------------------------------------------------
 * * ***Marker interface to configure Rzl **Ziggy Route** type checking behavior.***
 * -------------------------------------------------------
 */
interface TypeConfig {
}
/** -------------------------------------------------------
 * * ***A route name registered with **Ziggy Route**.***
 * -------------------------------------------------------
 */
type KnownRouteName = keyof RouteList;
/** -------------------------------------------------------
 * * ***A route name, or any string.***
 * -------------------------------------------------------
 */
type RouteName = KnownRouteName | (string & {});
/** -------------------------------------------------------
 * * ***A valid route name to pass to `route()` to generate a URL.***
 * -------------------------------------------------------
 */
type ValidRouteName = TypeConfig extends {
    strictRouteNames: true;
} ? KnownRouteName : RouteName;
/** -------------------------------------------------------
 * * ***Information about a single route parameter.***
 * -------------------------------------------------------
 */
type ParameterInfo = {
    name: string;
    required: boolean;
    binding?: string;
};
/** -------------------------------------------------------
 * * ***A primitive route parameter value, as it would appear in a URL.***
 * -------------------------------------------------------
 */
type RawParameterValue = string | number;
/** -------------------------------------------------------
 * * ***An object parameter value containing the 'default' binding key `id`, e.g. representing an Eloquent model.***
 * -------------------------------------------------------
 */
type DefaultRoutable = {
    id: RawParameterValue;
} & Record<keyof any, unknown>;
/** -------------------------------------------------------
 * * ***A route parameter value (`RawParameterValue` or `DefaultRoutable`).***
 * -------------------------------------------------------
 */
type ParameterValue = RawParameterValue | DefaultRoutable;
/** -------------------------------------------------------
 * * ***A route parameter value (`DefaultRoutable`).***
 * -------------------------------------------------------
 */
type ParameterValueProps = DefaultRoutable;
/** -------------------------------------------------------
 * * ***A parse-able route parameter, either plain or nested inside an object under its binding key.***
 * -------------------------------------------------------
 */
type Routable<I extends ParameterInfo> = I extends {
    binding: string;
} ? ({
    [K in I["binding"]]: RawParameterValue;
} & Record<keyof any, unknown>) | RawParameterValue : ParameterValue;
type RequiredParams<I extends readonly ParameterInfo[]> = Extract<I[number], {
    required: true;
}>;
type OptionalParams<I extends readonly ParameterInfo[]> = Extract<I[number], {
    required: false;
}>;
/** -------------------------------------------------------
 * * ***An object containing a special `'_query'` key to target the query string of a URL.***
 * -------------------------------------------------------
 */
type HasQueryParam = {
    _query?: Record<string, unknown>;
};
/** -------------------------------------------------------
 * * ***An object of parameters for an unspecified route.***
 * -------------------------------------------------------
 */
type GenericRouteParamsObject = Record<keyof any, unknown> & HasQueryParam;
/** -------------------------------------------------------
 * * ***An object of parameters for a specific named route.***
 * -------------------------------------------------------
 */
type KnownRouteParamsObject<I extends readonly ParameterInfo[]> = {
    [T in RequiredParams<I> as T["name"]]: Routable<T>;
} & {
    [T in OptionalParams<I> as T["name"]]?: Routable<T>;
} & GenericRouteParamsObject;
/** -------------------------------------------------------
 * * ***An object of route parameters.***
 * -------------------------------------------------------
 */
type RouteParamsObject<N extends RouteName> = N extends KnownRouteName ? KnownRouteParamsObject<RouteList[N]> : GenericRouteParamsObject;
/** -------------------------------------------------------
 * * ***An array of parameters for an unspecified route.***
 * -------------------------------------------------------
 */
type GenericRouteParamsArray = unknown[];
/** -------------------------------------------------------
 * * ***An array of parameters for a specific named route.***
 * -------------------------------------------------------
 */
type KnownRouteParamsArray<I extends readonly ParameterInfo[]> = [
    ...{
        [K in keyof I]: Routable<I[K]>;
    },
    ...unknown[]
];
/** -------------------------------------------------------
 * * ***An array of route parameters.***
 * -------------------------------------------------------
 */
type RouteParamsArray<N extends RouteName> = N extends KnownRouteName ? KnownRouteParamsArray<RouteList[N]> : GenericRouteParamsArray;
/** -------------------------------------------------------
 * * ***All possible parameter argument shapes for a route.***
 * -------------------------------------------------------
 */
type RouteParams<N extends RouteName> = RouteParamsObject<N> | RouteParamsArray<N>;
/** -------------------------------------------------------
 * * ***A Route Definition Type.***
 * -------------------------------------------------------
 */
type RouteDefinition = {
    uri: string;
    methods: ("GET" | "HEAD" | "POST" | "PATCH" | "PUT" | "OPTIONS" | "DELETE")[];
    domain?: string;
    parameters?: string[];
    bindings?: Record<string, string>;
    wheres?: Record<string, unknown>;
    middleware?: string[];
};
/** -------------------------------------------------------
 * * ***Config props for `route()` of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 */
type Config = {
    url: string;
    port: number | null;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, RouteDefinition>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
};
/** ------------------------------------------------------- */
type ParsedQs = {
    [key: string]: undefined | string | ParsedQs | (string | ParsedQs)[];
};
/** -------------------------------------------------------
 * * ***Router Instance Class of Rzl **Ziggy Route**.***
 * -------------------------------------------------------
 * **Calling `route()` function of Rzl **Ziggy Route** with no arguments will return an instance of
 * its JavaScript `Router` class, which has some other useful properties and methods.**
 */
type Router = {
    /** ---------------------------------------------
     * * ***Check the current route name: `route().current()`.***
     * ---------------------------------------------
     * **Returns the current Laravel route name (if any) based on the
     * browser's URL.**
     * @example
     * // Laravel route called 'events.index' with URI '/events'
     * // Current window URL is https://ziggy.test/events
     * route().current(); // ➔ 'events.index'
     *
     * @example
     * // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
     * // Current window URL is https://myapp.com/venues/1/events/2?hosts=all
     * route().current(); // ➔ 'venues.events.show'
     *
     * @see [Check **@rzl-zone/ziggy-route** the current route: ***`route().current()`***.](https://github.com/rzl-zone/ziggy-route#check-the-current-route-routecurrent)
     */
    current(): ValidRouteName | undefined;
    /** -------------------------------------------------------
     * * ***Check if the current route matches a name pattern: `route().current(name, [params])`.***
     * -------------------------------------------------------
     * **Tests whether the current route matches a given name or name pattern,
     * optionally verifying that certain parameters match the current URL.**
     * @param {RouteName} name   Route name or wildcard pattern (e.g. `"events.*"`).
     * @param {DefaultRoutable | RouteParams<T> | null} [params] Optional params to match against the current URL.
     * @example
     * // Laravel route called 'events.index' with URI '/events'
     * // Current window URL is https://ziggy.test/events
     * route().current('events.*');     // ➔ true
     * route().current('events.index'); // ➔ true
     * route().current('events.show');  // ➔ false
     *
     * @example
     * // `route().current()` optionally accepts parameters as its second argument, and will check that their values also match in the current URL:
     *
     * // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
     * // Current window URL is https://myapp.com/venues/1/events/2?hosts=all
     * route().current('venues.events.show', { venue: 1 });
     * // ➔ true
     * route().current('venues.events.show', { venue: 1, event: 2 });
     * // ➔ true
     * route().current('venues.events.show', { hosts: 'all' });
     * // ➔ true
     * route().current('venues.events.show', { venue: 6 });
     * // ➔ false
     *
     * @see [Check **@rzl-zone/ziggy-route** the current route: ***`route().current(...)`***.](https://github.com/rzl-zone/ziggy-route#check-the-current-route-routecurrent)
     */
    current<T extends RouteName>(name: T, params?: RouteParams<T> | ParameterValueProps | null): boolean;
    /** ---------------------------------------------
     * * ***Get all current parameters: `route().params`.***
     * ---------------------------------------------
     * **Returns an object of all parameters in the current URL,
     * including both **Laravel route parameters** and **query string values**.**
     * @example
     * // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
     * // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
     * route().params;
     * // ➔ { venue: '1', event: '2', hosts: 'all', type: 'test' }
     *
     * @see [Retrieve the current route with all params (query search params and laravel route params): ***`route().params`***.](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#retrieve-the-current-route-params-routeparams)
     */
    get params(): Record<string, string | undefined>;
    /** ---------------------------------------------
     * * ***Get only Laravel route parameters: `route().routeParams`.***
     * ---------------------------------------------
     * **Returns an object of **only the Laravel route parameters** from the
     * current URL, excluding query string parameters.**
     * @example
     * // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
     * // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
     * route().routeParams; // ➔ { venue: '1', event: '2' }
     *
     * @see [Retrieve only params route in laravel route (except query search params) in the current route: ***`route().routeParams`***.](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#retrieve-only-params-route-in-laravel-route-except-query-search-params-in-the-current-route-routerouteparams)
     */
    get routeParams(): Record<string, string | undefined>;
    /** ---------------------------------------------
     * * ***Get only query string parameters: `route().queryParams`.***
     * ---------------------------------------------
     * **Returns an object of **only the query string parameters** from
     * the current URL, excluding Laravel route parameters.**
     * @example
     * // Laravel route called 'venues.events.show' with URI '/venues/{venue}/events/{event}'
     * // Current window URL is https://myapp.com/venues/1/events/2?hosts=all&type=test
     * route().queryParams; // ➔ { hosts: 'all', type: 'test' }
     *
     * @see [Retrieve all search query params only (except params route in laravel route) in the current route: ***`route().queryParams`***.](https://github.com/rzl-zone/ziggy-route?tab=readme-ov-file#retrieve-all-search-query-params-only-except-params-route-in-laravel-route-in-the-current-route-routequeryparams)
     */
    get queryParams(): ParsedQs;
    /** ---------------------------------------------
     * * ***Check if a route exists: `route().has(name)`.***
     * ---------------------------------------------
     * **Determines whether a named route is registered.**
     * @param name
     *   The route name or wildcard pattern to check.
     *   - Accepts a full route name such as `"home"`.
     *   - Supports wildcard patterns like `"events.*"` to match multiple routes.
     *   - When `TypeConfig` is set with `strictRouteNames: true`,
     *     this parameter is limited to `KnownRouteName`.
     * @example
     * // Laravel app has only one named route, 'home'
     *
     * route().has('home');   // ➔ true
     * route().has('orders'); // ➔ false
     *
     * @see [Check **@rzl-zone/ziggy-route** if a route exists: ***`route().has(...)`***.](https://github.com/rzl-zone/ziggy-route#check-if-a-route-exists-routehas)
     */
    has<T extends ValidRouteName>(name: T): boolean;
};
/** -------------------------------------------------------
 * * ***Types For `RouteFactory` Class.***
 * -------------------------------------------------------
 */
type RouteFactoryConfig = {
    url: string;
    port: number | null;
    absolute?: boolean;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, RouteDefinition>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
};
/** -------------------------------------------------------
 * * ***Types For `RouterConfig` Class.***
 * -------------------------------------------------------
 */
type RouterConfig = {
    url: string;
    port: number | null;
    absolute?: boolean;
    defaults: Record<string, RawParameterValue>;
    routes: Record<string, RouteDefinition>;
    location?: {
        host?: string;
        pathname?: string;
        search?: string;
    };
};

export type { Config as C, KnownRouteName as K, ParameterValueProps as P, Router as R, TypeConfig as T, ValidRouteName as V, RouteParams as a, RouterConfig as b, ParameterValue as c, ParsedQs as d, RawParameterValue as e, RouteDefinition as f, RouteFactoryConfig as g, RouteList as h, RouteName as i };
