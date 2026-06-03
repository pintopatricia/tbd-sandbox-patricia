export const isJsonString = (str: any): boolean => {
  try {
    JSON.parse(str);
  } catch (err) {
    if (__DEV__) {
      console.log("isJsonString error", err);
    }
    return false;
  }
  return true;
};
