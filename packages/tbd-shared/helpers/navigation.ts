export const base64EncodeUrl = (str: string) => btoa(str).replace(/\+/g, "-").replace(/\//g, "!");
export const base64DecodeUrl = (str: string) => atob(str.replace(/-/g, "+").replace(/!/g, "/"));
