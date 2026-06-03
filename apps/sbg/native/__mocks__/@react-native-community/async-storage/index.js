let cache = {};
export default {
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== "string" || typeof value !== "string") {
        return reject(new Error("key and value must be string"));
      }
      cache[key] = value;
      return resolve(value);
    });
  },
  getItem: (key) => {
    return new Promise((resolve, reject) => {
      if (typeof key !== "string") {
        return reject(new Error("key and value must be string"));
      }
      return Object.prototype.hasOwnProperty.call(cache, key) ? resolve(cache[key]) : resolve(null);
    });
  },
  removeItem: (key) => {
    return new Promise((resolve, reject) => {
      return Object.prototype.hasOwnProperty.call(cache, key)
        ? resolve(delete cache[key])
        : reject(Error("No such key!"));
    });
  },
  clear: () => {
    return new Promise((resolve) => {
      cache = {};
      return resolve(cache);
    });
  },

  getAllKeys: () => {
    return new Promise((resolve) => resolve(Object.keys(cache)));
  },
};
