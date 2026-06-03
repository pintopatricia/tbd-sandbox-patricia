export const SEO__VIEW_LOADED = "SEO/VIEW_LOADED";

export type SeoViewLoadedPayload = {
  metaTitle?: string;
  metaDescription?: string;
};

export type SeoViewLoadedAction = {
  type: typeof SEO__VIEW_LOADED;
  payload: SeoViewLoadedPayload;
};
