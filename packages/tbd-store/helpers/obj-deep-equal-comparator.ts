import { objectDeepSort } from "./sorting";

/**
 * Compares two objects deeply for equality
 * @param {Record<string, unknown>} obj1 - The first object to compare
 * @param {Record<string, unknown>} obj2 - The second object to compare
 * @returns {boolean} - True if the objects are deeply equal, false otherwise
 */
export function areObjectsDeepEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const sortedObj1 = objectDeepSort(obj1, "asc");
  const sortedObj2 = objectDeepSort(obj2, "asc");

  function deepEqual(objA: unknown, objB: unknown): boolean {
    if (objA === objB) return true;
    if (typeof objA !== typeof objB || objA === null || objB === null) return false;
    if (typeof objA !== "object" || typeof objB !== "object") return false;

    if (objA instanceof Set && objB instanceof Set) {
      if (objA.size !== objB.size) return false;
      return [...objA].every((valueA) => [...objB].some((valueB) => deepEqual(valueA, valueB)));
    }

    if (objA instanceof Map && objB instanceof Map) {
      if (objA.size !== objB.size) return false;
      return Array.from(objA.keys()).every((key) => deepEqual(objA.get(key), objB.get(key)));
    }

    const objAKeys = Object.keys(objA);
    const objBKeys = Object.keys(objB);

    if (objAKeys.length !== objBKeys.length) return false;

    return objAKeys.every(
      (key) =>
        objBKeys.includes(key) &&
        deepEqual((objA as Record<string, unknown>)[key], (objB as Record<string, unknown>)[key]),
    );
  }

  return deepEqual(sortedObj1, sortedObj2);
}
