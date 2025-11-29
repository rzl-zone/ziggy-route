import type {
  RawParameterValue,
  RouteDefinition,
  RouterConfig
} from "../types";

import {
  getPreciseType,
  hasOwnProp,
  isError,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";

import { CONFIG } from "@ts/utils/constants";
import { realValue } from "@ts/utils/stringValue";

import { RouterConfigError } from "./exceptions";

const { REPO } = CONFIG;
const docsErrorLinkRepo = `\n\nℹ️ Learn more: \`${REPO.LINK}#importing-the-route-function\`.`;

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

  /** Check object like RouterConfig
   *
   * @internal
   */
  private static isRouterConfigRaw(obj: unknown): obj is RouterConfig {
    if (!isPlainObject(obj)) return false;

    // object
    if (!isPlainObject<Partial<RouterConfig>>(obj)) {
      throw new RouterConfigError(
        `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${getPreciseType(obj)}\`, with value: \`${realValue(obj)}\`.${docsErrorLinkRepo}`
      );
    }

    // url
    if (!isString(obj.url)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.url\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.url\`.\n  - Parameter \`config.url\` must be of type \`string\` or \`null\`, but received: \`${getPreciseType(obj.url)}\`.${docsErrorLinkRepo}`
      );
    }
    // port
    if (!isNull(obj.port) && !isNumber(obj.port)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.port\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.port\`.\n  - Parameter \`config.port\` must be of type \`number\` or \`null\`, but received: \`${getPreciseType(obj.port)}\`, with value: \`${realValue(obj.port)}\`.${docsErrorLinkRepo}`
      );
    }
    // defaults
    if (!isPlainObject(obj.defaults)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.defaults\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.defaults\`.\n  - Parameter \`config.defaults\` must be of type \`plain-object\` defaults property, but received: \`${getPreciseType(obj.defaults)}\`, with value: \`${realValue(obj.defaults)}\`.${docsErrorLinkRepo}`
      );
    }
    // routes
    if (!isPlainObject(obj.routes)) {
      throw new RouterConfigError(
        `Invalid \`route()\` parameter \`config.routes\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid \`config.routes\`.\n  - Parameter \`config.routes\` must be of type \`plain-object\` routes property, but received: \`${getPreciseType(obj.routes)}\`, with value: \`${realValue(obj.routes)}\`.${docsErrorLinkRepo}`
      );
    }

    // location (optional)
    if (hasOwnProp(obj, "location")) {
      const loc = obj.location;

      if (!isPlainObject(loc)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.\n  - Parameter \`config.location\` must be of type \`plain-object ({ host?: string | undefined; pathname?: string | undefined; search?: string | undefined; })\` of location property, but received: \`${getPreciseType(loc)}\`, with value: \`${realValue(loc)}\`.${docsErrorLinkRepo}`
        );
      }

      const l = loc;
      if (hasOwnProp(l, "host") && !isString(l.host)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.host\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.\n  - Parameter \`config.location.host\` must be of type \`string\` or \`undefined\`, but received: \`${getPreciseType(l.host)}\`, with value: \`${realValue(l.host)}\`.${docsErrorLinkRepo}`
        );
      }
      if (hasOwnProp(l, "pathname") && !isString(l.pathname)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.pathname\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.\n  - Parameter \`config.location.pathname\` must be of type \`string\` or \`undefined\`, but received: \`${getPreciseType(l.pathname)}\`, with value: \`${realValue(l.pathname)}\`.${docsErrorLinkRepo}`
        );
      }
      if (hasOwnProp(l, "search") && !isString(l.search)) {
        throw new RouterConfigError(
          `Invalid \`route()\` parameter \`config.location.search\` property of the \`config\` (fourth parameter) detected:\n- Ensure that \`appLocation\` is defined globally or passed as a valid \`config.location\`.\n  - Parameter \`config.location.search\` must be of type \`string\` or \`undefined\`, but received: \`${getPreciseType(l.search)}\`, with value: \`${realValue(l.search)}\`.${docsErrorLinkRepo}`
        );
      }
    }

    // passed all checks
    return true;
  }

  /** Validate & convert unknown object to RouterConfigClass
   *
   * @internal
   */
  public static validateAndWrap(obj: unknown): RouterConfigClass {
    try {
      if (obj instanceof RouterConfigClass) return obj;

      if (!this.isRouterConfigRaw(obj)) {
        throw new RouterConfigError(
          `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${getPreciseType(obj)}\`, with value: \`${realValue(obj)}\`.${docsErrorLinkRepo}`
        );
      }

      return new RouterConfigClass(obj);
    } catch (err) {
      if (err instanceof RouterConfigError) throw err;

      throw new RouterConfigError(
        `Invalid \`route()\` the \`config\` property at (fourth parameter) detected:\n- Ensure that \`appRoutes\` is defined globally or passed as a valid config object, but received: \`${getPreciseType(obj)}\`, with value: \`${realValue(obj)}\`.${docsErrorLinkRepo}`,
        isError(err) ? err : new Error(String(err))
      );
    }
  }
}
