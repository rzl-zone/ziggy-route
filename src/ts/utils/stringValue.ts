import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

/** Check the real value then convert to string.
 *
 * @param value Value to check.
 * @returns {string} The real value using {@link safeStableStringify | **`safeStableStringify`**} with keepUndefined options.
 */
export const realValue = (value: unknown): string => {
  return safeStableStringify(value, { keepUndefined: true });
};
