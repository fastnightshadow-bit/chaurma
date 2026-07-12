export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly origin: string;
  readonly currency: "RUB";
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly cartStorageKey: string;
  readonly cartMaxAgeHours: number;
  readonly routeUrlTemplate: string;
  readonly mapProvider: "yandex";
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly isTemporaryData: boolean;
}
