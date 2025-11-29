/*!
 * ====================================================
 * Rzl Ziggy-Route.
 * ----------------------------------------------------
 * Version: 0.0.13.
 * Author: Rizalvin Dwiky.
 * Repository: https://github.com/rzl-zone/ziggy-route.
 * ====================================================
 */
'use strict';

var chunk4M7PUXSA_cjs = require('./chunk-4M7PUXSA.cjs');
var qs = require('qs');

var RouterConfigError = class extends Error {
  constructor(message, originalError, prefix) {
    const trimmedPrefix = prefix?.trim() || chunk4M7PUXSA_cjs.CONFIG.PACKAGE.PREFIX.NAME;
    const trimmedMessage = message.trim();
    super(
      `
${trimmedPrefix.startsWith("\u274C") ? trimmedPrefix : "\u274C " + trimmedPrefix} - ${trimmedMessage}`
    );
    this.originalError = originalError;
    this.name = "RouteConfigError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoutePropsError);
    }
  }
};
var RoutePropsError = class _RoutePropsError extends Error {
  constructor(message, originalError, prefix) {
    const trimmedPrefix = prefix?.trim() || chunk4M7PUXSA_cjs.CONFIG.PACKAGE.PREFIX.NAME;
    const trimmedMessage = message.trim();
    super(
      `
${trimmedPrefix.startsWith("\u274C") ? trimmedPrefix : "\u274C " + trimmedPrefix} - ${trimmedMessage}`
    );
    this.originalError = originalError;
    this.name = "RoutePropsError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _RoutePropsError);
    }
  }
};

var RouteFactory = class {
  name;
  definition;
  config;
  wheres;
  bindings = {};
  constructor(name, definition, config) {
    this.name = name;
    this.definition = definition;
    this.bindings = definition?.bindings ?? {};
    this.wheres = definition?.wheres ?? {};
    this.config = config;
  }
  /** -------------------------------------------------------
   * * ***Get a 'template' of the complete URL for this route.***
   * -------------------------------------------------------
   *
   * @example
   * https://{team}.rzlzone.dev/user/{user}
   *
   * @return {String} Route template.
   */
  get template() {
    const template = `${this.origin}/${this.definition?.uri}`.replace(
      /\/+$/,
      ""
    );
    return chunk4M7PUXSA_cjs.isEmptyString(template) ? "/" : template;
  }
  /** -------------------------------------------------------
   * * ***Get a template of the origin for this route.***
   * -------------------------------------------------------
   *
   * @example
   * https://{team}.rzlzone.dev/
   *
   * @return {String} Route origin template.
   */
  get origin() {
    if (!this.config?.absolute) return "";
    if (this.definition?.domain) {
      const match = this.config.url.match(/^\w+:\/\//);
      if (!match) {
        throw new RouterConfigError(
          `Invalid \`config.url\` missing protocol (e.g., \`"http://"\` or \`"https://"\`).`
        );
      }
      const protocol = match[0];
      return `${protocol}${this.definition.domain}${this.config.port ? `:${this.config.port}` : ""}`;
    }
    return this.config.url;
  }
  /** -----------------------------------------------
   * * ***Get an array of objects representing the parameters that this route accepts.***
   * -----------------------------------------------
   *
   * @example
   * [{ name: 'team', required: true }, { name: 'user', required: false }]
   *
   * @return {Array<{name:string,required:boolean}>} Parameter segments.
   */
  get parameterSegments() {
    return this.template.match(/{[^}?]+\??}/g)?.map((segment) => ({
      name: segment.replace(/{|\??}/g, ""),
      required: !/\?}$/.test(segment)
    })) ?? [];
  }
  /** -----------------------------------------------
   * * ***Get whether this route's template matches the given URL.***
   * -----------------------------------------------
   */
  matchesUrl(url) {
    if (!this.definition?.methods.includes("GET")) return false;
    const pattern = this.template.replace(/[.*+$()[\]]/g, "\\$&").replace(
      /(\/?){([^}?]*)(\??)}/g,
      (_, slash, segment, optional) => {
        const regex = `(?<${segment}>${this.wheres[segment]?.replace(/(^\^)|(\$$)/g, "") || "[^/?]+"})`;
        return optional ? `(${slash}${regex})?` : `${slash}${regex}`;
      }
    ).replace(/^\w+:\/\//, "");
    const [location, query] = url.replace(/^\w+:\/\//, "").split("?");
    const matches = new RegExp(`^${pattern}/?$`).exec(location) ?? new RegExp(`^${pattern}/?$`).exec(decodeURI(location));
    if (matches) {
      for (const k in matches.groups) {
        matches.groups[k] = chunk4M7PUXSA_cjs.isString(matches.groups[k]) ? decodeURIComponent(matches.groups[k]) : matches.groups[k];
      }
      return { params: matches.groups, query: qs.parse(query) };
    }
    return false;
  }
  /** -----------------------------------------------
   * * ***Hydrate and return a complete URL for this route with the given parameters.***
   * -----------------------------------------------
   *
   * @param {Record<string,any>} params
   * @return {String}
   */
  compile(params = {}) {
    const url = this.template.replace(
      /{([^}?]+)(\??)}/g,
      (_match, segment, optional) => {
        const value = params[segment];
        if (!optional && chunk4M7PUXSA_cjs.isNil(value)) {
          throw new RoutePropsError(
            `Invalid \`"${segment}"\` parameter is required for route \`"${this.name}"\`.`
          );
        }
        const wheresSegment = this.wheres[segment];
        if (wheresSegment) {
          const regex = new RegExp(`^${wheresSegment}$`);
          if (chunk4M7PUXSA_cjs.isString(value) && !regex.test(value)) {
            throw new RoutePropsError(
              `Invalid \`"${segment}"\` parameter \`"${value}"\` does not match required format \`${wheresSegment}\` for route \`"${this.name}"\`.`
            );
          }
        }
        return encodeURI(chunk4M7PUXSA_cjs.isString(value) ? value : "").replace(/%7C/g, "|").replace(/%25/g, "%").replace(/\$/g, "%24");
      }
    );
    let finalUrl = url;
    if (this.config?.absolute && url.includes("://")) {
      const [protocol, rest] = url.split("://");
      finalUrl = protocol + "://" + rest.replace(/\/{2,}/g, "/");
    } else {
      finalUrl = url.replace(/\/{2,}/g, "/");
    }
    return finalUrl === "/" ? "/" : finalUrl.replace(/\/+$/, "");
  }
};

var { REPO } = chunk4M7PUXSA_cjs.CONFIG;
var docsErrorLinkRepo = `

\u2139\uFE0F Learn more: \`${REPO.LINK}#importing-the-route-function\`.`;
var RouterConfigClass = class _RouterConfigClass {
  absolute;
  url;
  port;
  defaults;
  routes;
  location;
  constructor(config) {
    this.absolute = config.absolute;
    this.url = config.url;
    this.port = config.port;
    this.defaults = config.defaults;
    this.routes = config.routes;
    this.location = config.location;
  }
  /** Check object like RouterConfig
   *
   * @internal
   */
  static isRouterConfigRaw(obj) {
    if (!chunk4M7PUXSA_cjs.isPlainObject(obj)) return false;
    if (!chunk4M7PUXSA_cjs.isPlainObject(obj)) {
      throw new RouterConfigError(
        `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj)}\`.${docsErrorLinkRepo}`
      );
    }
    if (!chunk4M7PUXSA_cjs.isString(obj.url)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.url\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.url\`.
  - Parameter \`config.url\` must be of type \`string\` or \`null\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj.url)}\`.${docsErrorLinkRepo}`
      );
    }
    if (!chunk4M7PUXSA_cjs.isNull(obj.port) && !chunk4M7PUXSA_cjs.isNumber(obj.port)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.port\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.port\`.
  - Parameter \`config.port\` must be of type \`number\` or \`null\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj.port)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj.port)}\`.${docsErrorLinkRepo}`
      );
    }
    if (!chunk4M7PUXSA_cjs.isPlainObject(obj.defaults)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.defaults\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.defaults\`.
  - Parameter \`config.defaults\` must be of type \`plain-object\` defaults property, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj.defaults)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj.defaults)}\`.${docsErrorLinkRepo}`
      );
    }
    if (!chunk4M7PUXSA_cjs.isPlainObject(obj.routes)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.routes\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.routes\`.
  - Parameter \`config.routes\` must be of type \`plain-object\` routes property, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj.routes)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj.routes)}\`.${docsErrorLinkRepo}`
      );
    }
    if (chunk4M7PUXSA_cjs.hasOwnProp(obj, "location")) {
      const loc = obj.location;
      if (!chunk4M7PUXSA_cjs.isPlainObject(loc)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.
  - Parameter \`config.location\` must be of type \`plain-object ({ host?: string | undefined; pathname?: string | undefined; search?: string | undefined; })\` of location property, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(loc)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(loc)}\`.${docsErrorLinkRepo}`
        );
      }
      const l = loc;
      if (chunk4M7PUXSA_cjs.hasOwnProp(l, "host") && !chunk4M7PUXSA_cjs.isString(l.host)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.host\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.
  - Parameter \`config.location.host\` must be of type \`string\` or \`undefined\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(l.host)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(l.host)}\`.${docsErrorLinkRepo}`
        );
      }
      if (chunk4M7PUXSA_cjs.hasOwnProp(l, "pathname") && !chunk4M7PUXSA_cjs.isString(l.pathname)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.pathname\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.
  - Parameter \`config.location.pathname\` must be of type \`string\` or \`undefined\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(l.pathname)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(l.pathname)}\`.${docsErrorLinkRepo}`
        );
      }
      if (chunk4M7PUXSA_cjs.hasOwnProp(l, "search") && !chunk4M7PUXSA_cjs.isString(l.search)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.search\` property of the \`config\` (fourth parameter) detected:
- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.
  - Parameter \`config.location.search\` must be of type \`string\` or \`undefined\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(l.search)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(l.search)}\`.${docsErrorLinkRepo}`
        );
      }
    }
    return true;
  }
  /** Validate & convert unknown object to RouterConfigClass
   *
   * @internal
   */
  static validateAndWrap(obj) {
    try {
      if (obj instanceof _RouterConfigClass) return obj;
      if (!this.isRouterConfigRaw(obj)) {
        throw new RouterConfigError(
          `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj)}\`.${docsErrorLinkRepo}`
        );
      }
      return new _RouterConfigClass(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) throw err;
      throw new RouterConfigError(
        `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:
- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(obj)}\`, with value: \`${chunk4M7PUXSA_cjs.realValue(obj)}\`.${docsErrorLinkRepo}`,
        chunk4M7PUXSA_cjs.isError(err) ? err : new Error(String(err))
      );
    }
  }
};

var { REPO: REPO2, PACKAGE } = chunk4M7PUXSA_cjs.CONFIG;
var Router = class extends String {
  _config;
  _route;
  _params = {};
  constructor(name, params, absolute = false, config) {
    super();
    if (!chunk4M7PUXSA_cjs.isNil(name) && chunk4M7PUXSA_cjs.isEmptyString(name)) {
      throw new RoutePropsError(
        `Invalid \`route()\`:
- First parameter (\`name\`) must be of type a \`string\` and a non empty-string.
- Use \`undefined\` if you don't want to provide a name.
- Make sure to call a valid \`Router\` instance method, or you'll encounter an error. 

\u2139\uFE0F Learn more: \`${REPO2.LINK}#%EF%B8%8F-warning-calling-route-without-arguments\`.`
      );
    }
    if (!chunk4M7PUXSA_cjs.isNull(absolute) && !chunk4M7PUXSA_cjs.isBoolean(absolute)) {
      throw new RoutePropsError(
        `Invalid \`route()\`:
- Third parameter (\`absolute\`) must be of type a \`boolean\` or \`undefined\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(absolute)}\`. 

\u2139\uFE0F Learn more: \`${REPO2.LINK}#absolute-url\`.`
      );
    }
    absolute = !!absolute;
    const _config = this.safeValidateRouterConfig(
      config || chunk4M7PUXSA_cjs.isNull(config) ? config : typeof appRoutes !== "undefined" ? appRoutes : globalThis.appRoutes
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
  /** @internal */
  safeValidateRouterConfig(obj) {
    try {
      return RouterConfigClass.validateAndWrap(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) {
        throw err;
      }
      throw new Error(
        `${PACKAGE.PREFIX.NAME} - Unknown error while validating \`route()\` config`,
        {
          cause: chunk4M7PUXSA_cjs.isError(err) ? err : void 0
        }
      );
    }
  }
  /** @internal */
  _unresolve(url) {
    if (!url) {
      url = this._currentUrl();
    } else if (this._config.absolute && url.startsWith("/")) {
      url = this._location().host + url;
    }
    let matchedParams = {};
    const [name, route2] = Object.entries(this._config.routes).find(
      ([name2, route3]) => matchedParams = new RouteFactory(name2, route3, this._config).matchesUrl(
        url
      )
    ) || [void 0, void 0];
    return {
      name,
      ...matchedParams,
      route: route2
    };
  }
  /** @internal */
  _currentUrl() {
    const { host, pathname, search } = this._location();
    return (this._config.absolute ? host + pathname : pathname.replace(this._config.url.replace(/^\w*:\/\/[^/]+/, ""), "").replace(/^\/+/, "/")) + search;
  }
  /** @internal */
  _location() {
    const {
      host = "",
      pathname = "",
      search = ""
    } = !chunk4M7PUXSA_cjs.isServer() ? window.location : {};
    return {
      host: this._config.location?.host ?? host,
      pathname: this._config.location?.pathname ?? pathname,
      search: this._config.location?.search ?? search
    };
  }
  /** @internal */
  _parse(params = {}, route2 = this._route) {
    if (!chunk4M7PUXSA_cjs.isPlainObject(params) && !chunk4M7PUXSA_cjs.isArray(params)) {
      throw new RoutePropsError(
        `Invalid \`route()\` \`params\` property detected. 
- Second Parameter (\`params\`) must be of type \`plain-object\` or \`array\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(params)}\`.

\u2139\uFE0F More info: ${REPO2.LINK}#parameters.`
      );
    }
    params ??= {};
    params = ["string", "number"].includes(typeof params) ? [params] : params;
    const segments = route2?.parameterSegments.filter(
      ({ name }) => !this._config.defaults[name]
    );
    if (chunk4M7PUXSA_cjs.isArray(params)) {
      params = params.reduce(
        (result, current, i) => segments?.[i] ? { ...result, [segments[i].name]: current } : chunk4M7PUXSA_cjs.isPlainObject(current) || chunk4M7PUXSA_cjs.isArray(current) ? { ...result, ...current } : { ...result, ...chunk4M7PUXSA_cjs.isString(current) ? { [current]: "" } : {} },
        {}
      );
    } else if (segments?.length === 1 && !params[segments?.[0].name] && (route2 && params.hasOwnProperty(Object.values(route2.bindings)[0]) || params.hasOwnProperty("id"))) {
      params = { [segments?.[0].name]: params };
    }
    return {
      ...this._defaults(route2),
      ...this._substituteBindings(params, route2)
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
   *
   * @internal
   */
  _defaults(route2) {
    return route2?.parameterSegments.filter(({ name }) => this._config.defaults[name]).reduce(
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
   *
   * @internal
   */
  _substituteBindings(params, route2 = this._route) {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (!value || typeof value !== "object" || chunk4M7PUXSA_cjs.isArray(value) || !route2?.parameterSegments.some(({ name }) => name === key)) {
        return { ...result, [key]: value };
      }
      if (!value.hasOwnProperty(route2.bindings[key])) {
        if (value.hasOwnProperty("id")) {
          route2.bindings[key] = "id";
        } else {
          throw new RoutePropsError(
            `Object passed as \`"${key}"\` parameter is missing route model binding key \`${route2.bindings[key]}\`.

\u2139\uFE0F More info: ${REPO2.LINK}#parameters.`
          );
        }
      }
      return {
        ...result,
        ...{ [key]: value[route2.bindings[key]] }
      };
    }, {});
  }
  get params() {
    const { params, query } = this._unresolve();
    const flatQuery = {};
    for (const key in query) {
      const val = query[key];
      if (chunk4M7PUXSA_cjs.isString(val)) {
        flatQuery[key] = val;
      } else if (chunk4M7PUXSA_cjs.isArray(val)) {
        flatQuery[key] = val.filter(chunk4M7PUXSA_cjs.isString).join(",");
      } else if (chunk4M7PUXSA_cjs.isObject(val)) {
        flatQuery[key] = chunk4M7PUXSA_cjs.safeStableStringify(val);
      }
    }
    return {
      ...params,
      ...flatQuery
    };
  }
  get routeParams() {
    return this._unresolve().params || {};
  }
  get queryParams() {
    return this._unresolve().query || {};
  }
  has(name) {
    if (!chunk4M7PUXSA_cjs.isString(name)) {
      throw new RoutePropsError(
        `Invalid \`route().has(...)\` parameter \`name\` detected.
- First parameter (\`name\`) must be of type \`string\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(name)}\`.`
      );
    }
    return this._config.routes.hasOwnProperty(name);
  }
  current(name, params = {}) {
    if (name && !chunk4M7PUXSA_cjs.isString(name)) {
      throw new RoutePropsError(
        `Invalid \`route().current(...)\` parameter \`name\` detected.
- First parameter (\`name\`) must be of type \`string\`, but received: \`${chunk4M7PUXSA_cjs.getPreciseType(name)}\`.`
      );
    }
    if (params && !(chunk4M7PUXSA_cjs.isPlainObject(params) || chunk4M7PUXSA_cjs.isArray(params))) {
      throw new RoutePropsError(
        `Invalid parameter \`params\` (\`second parameter\`) value passed to \`route().current(...)\`, expected a object or array (e.g., { foo: "bar" } or [{"foo": "bar"}]), but received: \`${chunk4M7PUXSA_cjs.getPreciseType(params)}\`.

\u2139\uFE0F Learn more: \`${REPO2.LINK}#routecurrent-optionally-accepts-parameters-as-its-second-argument-and-will-check-that-their-values-also-match-in-the-current-url\`.`
      );
    }
    params ??= {};
    const {
      name: current,
      params: currentParams,
      query,
      route: route2
    } = this._unresolve();
    if (!name) return current;
    const match = chunk4M7PUXSA_cjs.isString(current) && new RegExp(`^${name.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`).test(
      current
    );
    if (chunk4M7PUXSA_cjs.isNil(params) || !match) return match;
    const routeObject = new RouteFactory(current, route2, this._config);
    params = this._parse(params, routeObject);
    const routeParams = { ...currentParams, ...query };
    if (Object.values(params).every((p) => !p) && !Object.values(routeParams).some((v) => !chunk4M7PUXSA_cjs.isUndefined(v))) {
      return true;
    }
    const isSubset = (subset, full) => {
      return Object.entries(subset).every(([key, value]) => {
        if (chunk4M7PUXSA_cjs.isArray(value) && chunk4M7PUXSA_cjs.isArray(full[key])) {
          const fKey = full[key];
          return value.every((v) => fKey.includes(v));
        }
        if (chunk4M7PUXSA_cjs.isObject(value) && chunk4M7PUXSA_cjs.isObject(full[key])) {
          return isSubset(value, full[key]);
        }
        return full[key] == value;
      });
    };
    return isSubset(params, routeParams);
  }
  toString() {
    const thisRoute = this._route;
    const thisParams = this._params ??= {};
    if (!thisRoute) {
      throw new RoutePropsError(
        `Function route() was called without a \`name\` (first parameter) but used as a \`string\`.
- Pass a valid route name, or use route().current() to get the current route name \u2014 or route().current('dashboard') to check if it matches.

\u2139\uFE0F More info: ${REPO2.LINK}#%EF%B8%8F-warning-calling-route-without-arguments.`
      );
    }
    const unhandled = Object.keys(thisParams).filter(
      (key) => !thisRoute.parameterSegments.some(({ name }) => name === key)
    ).filter((key) => key !== "_query").reduce(
      (result, current) => ({ ...result, [current]: thisParams[current] }),
      {}
    );
    const thisParamsQuery = thisParams["_query"];
    if (!chunk4M7PUXSA_cjs.isUndefined(thisParamsQuery) && !chunk4M7PUXSA_cjs.isPlainObject(thisParamsQuery)) {
      throw new RoutePropsError(
        `Invalid parameter \`_query\` property of the \`params\` (second parameter) value passed to \`route()\`, expected a \`plain-object\` (e.g., { foo: "bar" }), but received: \`${chunk4M7PUXSA_cjs.getPreciseType(thisParamsQuery)}\`.

\u2139\uFE0F More info: ${REPO2.LINK}#query-parameters.`
      );
    }
    return thisRoute.compile(thisParams) + qs.stringify(
      { ...unhandled, ...thisParamsQuery },
      {
        addQueryPrefix: true,
        arrayFormat: "indices",
        encodeValuesOnly: true,
        skipNulls: true,
        encoder: (value, encoder) => chunk4M7PUXSA_cjs.isBoolean(value) ? String(+value) : encoder(value)
      }
    );
  }
  valueOf() {
    return this.toString();
  }
};

function route(name, params, absolute = false, config) {
  const router = new Router(name, params, absolute, config);
  return name ? router.toString() : router;
}

exports.RouterConfigError = RouterConfigError;
exports.route = route;
