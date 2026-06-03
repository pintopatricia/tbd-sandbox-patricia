type OrderType = "asc" | "desc";
type ObjectType = Record<string, unknown> | Record<string, unknown>[];

/**
 * Deeply compares two values (including objects and arrays) and sorts them based on the specified order.
 * @param {unknown} a - The first value to compare.
 * @param {unknown} b - The second value to compare.
 * @param {OrderType} order - The order to sort the values, either "asc" for ascending or "desc" for descending.
 * @returns {number} - Returns 0 if the values are equal, -1 if `a` is less than `b`, and 1 if `a` is greater than `b`.
 */
function deepSortCompare(a: unknown, b: unknown, order: OrderType = "asc"): number {
  if (a === b) return 0;
  if (a == null) return order === "asc" ? -1 : 1;
  if (b == null) return order === "asc" ? 1 : -1;

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLength = Math.max(a.length, b.length);
    for (let i = 0; i < maxLength; i += 1) {
      const comparisonValue = deepSortCompare(a[i], b[i], order);
      if (comparisonValue !== 0) return comparisonValue;
    }
    return 0;
  }

  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    const maxLength = Math.max(aKeys.length, bKeys.length);

    for (let i = 0; i < maxLength; i += 1) {
      const keyA = aKeys[i];
      const keyB = bKeys[i];

      if (keyA !== keyB) {
        if (order === "asc") {
          return keyA < keyB ? -1 : 1;
        }
        return keyA > keyB ? -1 : 1;
      }

      const comparisonValue = deepSortCompare(
        (a as Record<string, unknown>)[keyA],
        (b as Record<string, unknown>)[keyB],
        order,
      );
      if (comparisonValue !== 0) return comparisonValue;
    }

    return 0;
  }

  if (order === "asc") {
    return a < b ? -1 : 1;
  }
  return a > b ? -1 : 1;
}

/**
 * Sorts an object deeply by its keys
 * @param {ObjectType} obj - The object to sort
 * @param {OrderType} order - The order to sort the object
 * @returns The sorted object
 */
export function objectDeepSort(obj: ObjectType, order: OrderType = "asc"): object {
  if (obj instanceof Map) {
    const sortedEntries: [unknown, unknown][] = Array.from(obj.entries())
      .sort(([keyA], [keyB]) => deepSortCompare(keyA, keyB, order))
      .map(([key, value]) => [
        key,
        (value && typeof value === "object") || Array.isArray(value) ? objectDeepSort(value, order) : value,
      ]);

    return new Map(sortedEntries);
  }

  if (obj instanceof Set) {
    const sortedValues = Array.from(obj)
      .map((value) =>
        (value && typeof value === "object") || Array.isArray(value) ? objectDeepSort(value, order) : value,
      )
      .sort((a, b) => deepSortCompare(a, b, order));
    return new Set(sortedValues);
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map((item) => objectDeepSort(item, order)).sort((a, b) => deepSortCompare(a, b, order));
    }
    return Object.keys(obj)
      .sort((a, b) => deepSortCompare(a, b, order))
      .reduce((acc: Record<string, unknown>, key) => {
        if ((obj[key] && typeof obj[key] === "object") || Array.isArray(obj[key])) {
          acc[key] = objectDeepSort(<ObjectType>obj[key], order);
        } else {
          acc[key] = obj[key];
        }

        return acc;
      }, {});
  }
  return obj;
}
