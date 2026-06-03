const PATH_REGEX = ".*handleBannerAction.*";

/*
mock request to MAX that /cancels/confirms a deposit or loss limit or updates a news banner preference in usp(proxied by MAX)
 */
export const handleBannerAction = () => ({
  pathRegex: `${PATH_REGEX}`,
  response: "",
  method: "POST",
  statusCode: 200,
  delay: 0,
});
