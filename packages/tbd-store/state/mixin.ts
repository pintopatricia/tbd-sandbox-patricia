/* eslint-disable no-param-reassign, @typescript-eslint/no-use-before-define, no-restricted-syntax */

// Based on mixin-deep but with support to merge arrays
// https://github.com/jonschlinkert/mixin-deep

/**
 * Checks if a given value is an Object
 * @param val The value to check
 * @returns True if value is an object
 */
function isObject(val: any): boolean {
  return typeof val === "function" || (typeof val === "object" && val !== null && !Array.isArray(val));
}

/**
 * Checks if a given key is a valid prop and not prototype keys
 * @param key The key to check
 */
function isValidKey(key: string): boolean {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}

/**
 * Make sure that the update array size will be respected even if we already have more
 * data on the target
 * @param tar The target array to be mutated
 * @param obj The update array
 */
function trimArray(target: any[], update: any[]): void {
  if (target.length > update.length) {
    target.splice((target.length - update.length) * -1);
  }
}

/**
 * Merges a primitive property or call mixinDeep again for Objects and Arrays.
 *
 * This function is losely typed since it is not exposed and it would be a
 * nightmare to type it properly.
 *
 * @param target The object where the new props with be merged into
 * @param val The value to be updated
 * @param key The prop name
 */
function mixin(target: any, val: any, key: any): void {
  const obj = target[key];

  if (isObject(val) && isObject(obj)) {
    mixinDeep(obj, val);
  } else if (Array.isArray(val) && Array.isArray(obj)) {
    trimArray(obj, val);
    mixinDeep(obj, val);
  } else {
    target[key] = val;
  }
}

/**
 * Merges two objects. The target object will be mutated
 *
 * @param target The object where the new props with be merged into
 * @param obj The object that will update the target
 * @returns A reference for the mutated target
 */
function mixinDeep<T1 extends Record<string, any>, T2 extends Record<string, any>>(target: T1, obj: T2): T1 & T2 {
  if (isObject(obj) || Array.isArray(obj)) {
    for (const key in obj) {
      if (isValidKey(key)) {
        mixin(target, obj[key], key);
      }
    }
  }

  return target as T1 & T2;
}

export default mixinDeep;
