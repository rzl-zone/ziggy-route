import { stringify } from "qs";

import { CONFIG } from "@ts/utils/constants";
import RouteFactory from "./RouteFactory";
import { RouterConfigClass } from "./RouterConfigClass";
import { RoutePropsError, RouterConfigError } from "./exceptions";

import type {
  ParsedQs,
  RouteParams,
  RouterConfig
} from "@ts/ziggy-route/types";
import {
  getPreciseType,
  isArray,
  isBoolean,
  isEmptyString,
  isError,
  isNil,
  isNull,
  isObject,
  isPlainObject,
  isServer,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

const { REPO, PACKAGE } = CONFIG;

export class Router extends String {
  private _config: RouterConfig;
  private _route: RouteFactory | undefined;
  private _params: null | Record<string, unknown> = {};

  constructor(
    name?: string | null,
    params?: null | RouteParams<string> | unknown[] | Record<string, string>,
    absolute: boolean = false,
    config?: RouterConfig
  ) {
    super();

    if (!isNil(name) && isEmptyString(name)) {
      throw new RoutePropsError(
        `Invalid \`route()\`:\n- First parameter (\`name\`) must be of type a \`string\` and a non empty-string.\n- Use \`undefined\` if you don't want to provide a name.\n- Make sure to call a valid \`Router\` instance method, or you'll encounter an error. \n\nℹ️ Learn more: \`${REPO.LINK}#%EF%B8%8F-warning-calling-route-without-arguments\`.`
      );
    }

    if (!isNull(absolute) && !isBoolean(absolute)) {
      throw new RoutePropsError(
        `Invalid \`route()\`:\n- Third parameter (\`absolute\`) must be of type a \`boolean\` or \`undefined\`, but received: \`${getPreciseType(absolute)}\`. \n\nℹ️ Learn more: \`${REPO.LINK}#absolute-url\`.`
      );
    }

    // Ensure the value is a boolean.
    // Defensive fallback in case user passes `null` or `undefined`.
    absolute = !!absolute;

    const _config = this.safeValidateRouterConfig(
      config || globalThis.appRoutes
    );

    this._config = { ..._config, absolute };

    if (name) {
      if (!this._config.routes[name]) {
        throw new RoutePropsError(
          `Route name \`"${name}"\` (first parameter) is not in the route list.`
        );
      }

      this._route = new RouteFactory(
        name,
        this._config.routes[name],
        this._config
      );

      this._params = this._parse(params);
    }
  }

  private safeValidateRouterConfig(obj: unknown) {
    try {
      return RouterConfigClass.validateAndWrap(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) {
        throw err;
      }

      throw new Error(
        `${PACKAGE.PREFIX.NAME} - Unknown error while validating \`route()\` config`,
        {
          cause: isError(err) ? err : undefined
        }
      );
    }
  }

  private _unresolve(url?: string) {
    if (!url) {
      url = this._currentUrl();
    } else if (this._config.absolute && url.startsWith("/")) {
      url = this._location().host + url;
    }

    let matchedParams:
      | false
      | {
          params?: Record<string, string | undefined>;
          query?: ParsedQs;
        } = {};
    const [name, route] = Object.entries(this._config.routes).find(
      ([name, route]) =>
        (matchedParams = new RouteFactory(name, route, this._config).matchesUrl(
          url
        ))
    ) || [undefined, undefined];

    return {
      name,
      ...matchedParams,
      route: route
    };
  }

  private _currentUrl() {
    const { host, pathname, search } = this._location();

    return (
      (this._config.absolute
        ? host + pathname
        : pathname
            .replace(this._config.url.replace(/^\w*:\/\/[^/]+/, ""), "")
            .replace(/^\/+/, "/")) + search
    );
  }

  private _location() {
    const {
      host = "",
      pathname = "",
      search = ""
    } = !isServer() ? window.location : {};

    return {
      host: this._config.location?.host ?? host,
      pathname: this._config.location?.pathname ?? pathname,
      search: this._config.location?.search ?? search
    };
  }

  private _parse(
    params:
      | null
      | RouteParams<string>
      | unknown[]
      | Record<string, string> = {},
    route: typeof this._route = this._route
  ): Record<string, string> {
    if (!isPlainObject(params) && !isArray(params)) {
      throw new RoutePropsError(
        `Invalid \`route()\` \`params\` property detected. \n- Second Parameter (\`params\`) must be of type \`plain-object\` or \`array\`, but received: \`${getPreciseType(params)}\`.\n\nℹ️ More info: \`${REPO.LINK}#parameters\`.`
      );
    }

    // Fallback: if `params` is `null` or `undefined`, assign an empty object
    params ??= {};

    params = ["string", "number"].includes(typeof params) ? [params] : params;

    // Separate segments with and without defaults, and fill in the default values
    const segments = route?.parameterSegments.filter(
      ({ name }) => !this._config.defaults[name]
    );

    if (isArray(params)) {
      params = params.reduce(
        (result: object, current, i) =>
          segments?.[i]
            ? { ...result, [segments[i].name]: current }
            : isPlainObject(current) || isArray(current)
              ? { ...result, ...current }
              : { ...result, ...(isString(current) ? { [current]: "" } : {}) },
        {}
      );
    } else if (
      segments?.length === 1 &&
      !params[segments?.[0].name] &&
      ((route && params.hasOwnProperty(Object.values(route.bindings)[0])) ||
        params.hasOwnProperty("id"))
    ) {
      params = { [segments?.[0].name]: params };
    }

    return {
      ...this._defaults(route),
      ...this._substituteBindings(params as Record<string, string>, route)
    };
  }

  /**
   * Populate default parameters for the given route.
   *
   * @example
   * // with default parameters { locale: 'en', country: 'US' } and 'posts.show' route '{locale}/posts/{post}'
   * defaults(...); // { locale: 'en' }
   *
   * @param {Route} route
   * @return {Object} Default route parameters.
   */
  private _defaults(route: typeof this._route): {} | undefined {
    return route?.parameterSegments
      .filter(({ name }) => this._config.defaults[name])
      .reduce(
        (result, { name }) => ({
          ...result,
          [name]: this._config.defaults[name]
        }),
        {}
      );
  }

  /**
   * Substitute Laravel route model bindings in the given parameters.
   *
   * @example
   * _substituteBindings({ post: { id: 4, slug: 'hello-world', title: 'Hello, world!' } }, { bindings: { post: 'slug' } }); // { post: 'hello-world' }
   *
   * @param {Object} params - Route parameters.
   * @param {Object} route - Route definition.
   * @return {Object} Normalized route parameters.
   */
  private _substituteBindings(
    params: Record<string, string | Record<string, string>>,
    route: typeof this._route = this._route
  ): Record<string, string> {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (
        !value ||
        typeof value !== "object" ||
        isArray(value) ||
        !route?.parameterSegments.some(({ name }) => name === key)
      ) {
        return { ...result, [key]: value };
      }

      if (!value.hasOwnProperty(route.bindings[key])) {
        if (value.hasOwnProperty("id")) {
          route.bindings[key] = "id";
        } else {
          throw new RoutePropsError(
            `Object passed as \`"${key}"\` parameter is missing route model binding key \`${route.bindings[key]}\`.\n\nℹ️ More info: \`${REPO.LINK}#parameters\`.`
          );
        }
      }

      return {
        ...result,
        ...{ [key]: value[route.bindings[key]] }
      };
    }, {});
  }

  public get params(): Record<string, string | undefined> {
    const { params, query } = this._unresolve();
    const flatQuery: Record<string, string | undefined> = {};

    for (const key in query) {
      const val = query[key];
      if (isString(val)) {
        flatQuery[key] = val;
      } else if (isArray(val)) {
        flatQuery[key] = val.filter(isString).join(",");
      } else if (isObject(val)) {
        flatQuery[key] = safeStableStringify(val);
      }
    }

    return {
      ...params,
      ...flatQuery
    };
  }

  public get routeParams(): Record<string, string | undefined> {
    return this._unresolve().params || {};
  }

  public get queryParams(): ParsedQs {
    return this._unresolve().query || {};
  }

  public has(name: string): boolean {
    if (!isString(name)) {
      throw new RoutePropsError(
        `Invalid \`route().has(...)\` parameter \`name\` detected.\n- First parameter (\`name\`) must be of type \`string\`, but received: \`${getPreciseType(name)}\`.`
      );
    }
    return this._config.routes.hasOwnProperty(name);
  }

  public current(
    name?: string,
    params: null | Record<string, unknown> | Array<string> = {}
  ): boolean | string | undefined {
    if (name && !isString(name)) {
      throw new RoutePropsError(
        `Invalid \`route().current(...)\` parameter \`name\` detected.\n- First parameter (\`name\`) must be of type \`string\`, but received: \`${getPreciseType(name)}\`.`
      );
    }
    if (params && !(isPlainObject(params) || isArray(params))) {
      throw new RoutePropsError(
        `Invalid parameter \`params\` (\`second parameter\`) value passed to \`route().current(...)\`, expected a object or array (e.g., { foo: "bar" } or [{"foo": "bar"}]), but received: \`${getPreciseType(params)}\`.\n\nℹ️ Learn more: \`${REPO.LINK}#routecurrent-optionally-accepts-parameters-as-its-second-argument-and-will-check-that-their-values-also-match-in-the-current-url\`.`
      );
    }

    params ??= {};

    const {
      name: current,
      params: currentParams,
      query,
      route
    } = this._unresolve();

    if (!name) return current;

    const match =
      isString(current) &&
      new RegExp(`^${name.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(
        current
      );

    if (isNil(params) || !match) return match;

    const routeObject = new RouteFactory(current, route, this._config);

    params = this._parse(params, routeObject);
    const routeParams = { ...currentParams, ...query };

    if (
      Object.values(params).every((p) => !p) &&
      !Object.values(routeParams).some((v) => !isUndefined(v))
    ) {
      return true;
    }

    const isSubset = (
      subset: Record<string, unknown>,
      full: Record<string, unknown>
    ): boolean => {
      return Object.entries(subset).every(([key, value]) => {
        if (isArray(value) && isArray(full[key])) {
          const fKey = full[key];
          return value.every((v) => fKey.includes(v));
        }

        if (isObject(value) && isObject(full[key])) {
          return isSubset(value, full[key]);
        }

        return full[key] == value;
      });
    };

    return isSubset(params, routeParams);
  }

  public toString(): string {
    const thisRoute = this._route;
    const thisParams = (this._params ??= {});

    if (!thisRoute) {
      throw new RoutePropsError(
        `Function route() was called without a \`name\` (first parameter) but used as a \`string\`.\n- Pass a valid route name, or use route().current() to get the current route name — or route().current('dashboard') to check if it matches.\n\nℹ️ More info: \`${REPO.LINK}#%EF%B8%8F-warning-calling-route-without-arguments\`.`
      );
    }

    const unhandled = Object.keys(thisParams)
      .filter(
        (key) => !thisRoute.parameterSegments.some(({ name }) => name === key)
      )
      .filter((key) => key !== "_query")
      .reduce(
        (result, current) => ({ ...result, [current]: thisParams[current] }),
        {}
      );

    const thisParamsQuery = thisParams["_query"];

    if (!isUndefined(thisParamsQuery) && !isPlainObject(thisParamsQuery)) {
      throw new RoutePropsError(
        `Invalid parameter \`_query\` property of the \`params\` (second parameter) value passed to \`route()\`, expected a \`plain-object\` (e.g., { foo: "bar" }), but received: \`${getPreciseType(thisParamsQuery)}\`.\n\nℹ️ More info: \`${REPO.LINK}#query-parameters\`.`
      );
    }

    return (
      thisRoute.compile(thisParams) +
      stringify(
        { ...unhandled, ...thisParamsQuery },
        {
          addQueryPrefix: true,
          arrayFormat: "indices",
          encodeValuesOnly: true,
          skipNulls: true,
          encoder: (value, encoder) =>
            isBoolean(value) ? String(+value) : encoder(value)
        }
      )
    );
  }

  valueOf(): string {
    return this.toString();
  }
}
