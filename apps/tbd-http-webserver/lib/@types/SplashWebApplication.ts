export type SplashWebApplication = {
  getMaintenanceProductStatus(swaProduct: string, options?: Record<string, unknown>): Promise<boolean>;
};
