import type {
  RawParameterValue,
  RouteDefinition,
  RouterConfig
} from "../types";

import {
  isArray,
  isError,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectOrArray,
  isString,
  isUndefined
} from "@rzl-zone/utils-js";

import { RouterConfigError } from "./exceptions";

export class RouterConfigClass implements RouterConfig {
  public absolute?: boolean;
  public url: string;
  public port: number | null;
  public defaults: Record<string, RawParameterValue>;
  public routes: Record<string, RouteDefinition>;
  public location?: {
    host?: string;
    pathname?: string;
    search?: string;
  };

  constructor(config: RouterConfig) {
    this.absolute = config.absolute;
    this.url = config.url;
    this.port = config.port;
    this.defaults = config.defaults;
    this.routes = config.routes;
    this.location = config.location;
  }

  /** Check object like RouterConfig */
  private static isRouterConfigRaw(obj: unknown): obj is RouterConfig {
    if (isNil(obj)) return false;

    const o = obj;
    // object
    if (!isObject<Partial<RouterConfig>>(o)) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object, \`config\` need object type but you passing as \`${typeof o}\`.`
      );
    }

    // url
    if (!isString(o.url)) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.url\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.url\`, \`config.url\` need string or null type but you passing as \`${typeof o.url}\`.`
      );
    }
    // port
    if (!isNull(o.port) && !isNumber(o.port)) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.port\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.port\`, \`config.port\` need number or null type but you passing as \`${typeof o.port}\`.`
      );
    }
    // defaults
    if (!isObjectOrArray(o.defaults)) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.defaults\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.defaults\`, \`config.defaults\` need array or object type but you passing as \`${typeof o.defaults}\`.`
      );
    }
    // routes
    if (!isObject(o.routes)) {
      throw new RouterConfigError(
        `Invalid \`route()\` \`config.routes\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.routes\`, \`config.routes\` need object type but you passing as \`${isArray(o.routes) ? "Array" : typeof o.routes}\`.`
      );
    }

    // location (optional)
    if ("location" in o) {
      const loc = o.location;

      if (isString(loc)) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object, \`config.location\` need object type\`{ host?: string | undefined; pathname?: string | undefined ;search?: string | undefined; }\` but you passing as \`${typeof loc}\`.`
        );
      }

      if (!isObject(loc)) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location\`, \`config.location\` need object type but you passing as \`${isArray(loc) ? "Array" : typeof loc}\`.`
        );
      }

      const l = loc;
      if ("host" in l && !isString(l.host) && !isUndefined(l.host)) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.host\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.host\`, \`config.location.host\` need string or undefined type but you passing as \`${typeof l.host}\`.`
        );
      }
      if (
        "pathname" in l &&
        !isString(l.pathname) &&
        !isUndefined(l.pathname)
      ) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.pathname\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.pathname\`, \`config.location.pathname\` need string or undefined type but you passing as \`${typeof l.pathname}\`.`
        );
      }
      if ("search" in l && !isString(l.search) && !isUndefined(l.search)) {
        throw new RouterConfigError(
          `Invalid \`route()\` \`config.location.search\` properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.location.search\`, \`config.location.search\` need string or undefined type but you passing as \`${typeof l.search}\`.`
        );
      }
    }

    // passed all checks
    return true;
  }

  /** Validate & convert unknown object to RouterConfigClass */
  public static validateAndWrap(obj: unknown): RouterConfigClass {
    try {
      if (obj instanceof RouterConfigClass) {
        return obj;
      }

      if (!this.isRouterConfigRaw(obj)) {
        throw new RouterConfigError(
          `Invalid \`route()\` config properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object.`
        );
      }

      return new RouterConfigClass(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) {
        throw err;
      }

      throw new RouterConfigError(
        `Invalid \`route()\` config properties detected. Ensure that \`appRoutes\` is defined globally or passed as a valid config object.`,

        isError(err) ? err : new Error(String(err))
      );
    }
  }
}
