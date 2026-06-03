function Max(endpoint: string): { handleBannerAction: (data: string, actionType: string) => Promise<Response> } {
  async function handleBannerAction(data: string, actionType: string): Promise<Response> {
    const handleBannerActionUrl = `${endpoint}?actionType=${actionType}`;
    const response = await fetch(handleBannerActionUrl, {
      method: "POST",
      credentials: "include",
      body: data,
    });
    return response;
  }
  return {
    handleBannerAction,
  };
}
export default Max;
