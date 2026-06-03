/* eslint-disable no-bitwise */
import { objectDeepSort } from "./sorting";
/**
 * Hash an object using the FNV-1a algorithm
 *
 * This is combination of two 32bit hashes
 * One for the object sorted in ascending order
 * One for the object sorted in descending order
 * @param {Record<string, unknown> | Record<string, unknown>[]} obj - The object to hash
 * @returns The hash of the object
 */
export function hashObjectFnv1a(obj: Record<string, unknown> | Record<string, unknown>[]): string {
  const strAsc = JSON.stringify(objectDeepSort(obj, "asc"));
  const strDesc = JSON.stringify(objectDeepSort(obj, "desc"));

  let hashValAsc = 0x811c9dc5;
  let hashValDesc = 0x811c9dc5;

  const fnv32Prime = 0x01000193;

  for (let i = 0; i < strAsc.length; i += 1) {
    hashValAsc ^= strAsc.charCodeAt(i);
    hashValAsc *= fnv32Prime;
    hashValAsc >>>= 0;
  }

  for (let i = 0; i < strDesc.length; i += 1) {
    hashValDesc ^= strDesc.charCodeAt(i);
    hashValDesc *= fnv32Prime;
    hashValDesc >>>= 0;
  }

  const hashAsc = hashValAsc.toString(16);
  const hashDesc = hashValDesc.toString(16);

  return hashAsc + hashDesc;
}
