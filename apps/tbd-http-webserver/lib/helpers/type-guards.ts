export function isNotNull<T>(input: null | T): input is T {
  return input !== null;
}
