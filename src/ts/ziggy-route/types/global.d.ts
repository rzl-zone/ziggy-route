import { route as routerFn } from "@ts/ziggy-route/main/route";

declare global {
  var appRoutes: Record<string, unknown> | undefined;
  var route: typeof routerFn | undefined;

  interface GlobalThis {
    route?: typeof routerFn | undefined;
    appRoutes?: Record<string, unknown> | undefined;
  }
}
export {};
