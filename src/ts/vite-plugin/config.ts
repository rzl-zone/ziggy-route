import type { RequiredExcept } from "@rzl-zone/utils-js/types";

/** * ***Options for configuring the Rzl Ziggy Route plugin.*** */
export type Config = {
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

export const defaultConfig: RequiredExcept<Config, "group" | "url"> = {
  sail: false,
  types: true,
  typesOnly: false,
  delay: 250,
  throttle: 250,
  only: [],
  except: []
};
