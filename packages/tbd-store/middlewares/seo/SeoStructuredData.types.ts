export type SeoStructuredDataSportEventProperties = {
  name: string;
  startDate: string;
  endDate: string;
  eventURL: string;
  competitionName: string;
};

export type SeoStructuredDataSportEvent = {
  "@context": "https://schema.org";
  "@type": "SportsEvent";
  name: string;
  startDate: string;
  endDate: string;
  url: string;
  location: {
    "@type": "Place";
    name: string;
    address: {
      "@type": "PostalAddress";
      name: string;
    };
  };
};

export type SeoStructuredDataFAQProperties = {
  name: string;
  text: string;
};
