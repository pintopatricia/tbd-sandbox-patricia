/**
 * HTTP interface for behavior library. The library requires an interface similar to $http from angular. fetch is wrapped to behave similarly
 */
export const httpInterface = {
  get: (url, config) => fetch(url, config),
  post: (url, body, config) =>
    fetch(
      url,
      Object.assign(config, {
        method: "POST",
        body,
        headers: new Headers({ "content-type": "application/json" }),
      }),
    ).then((res) => {
      res.data = res.body || {};
      return res;
    }),
};
