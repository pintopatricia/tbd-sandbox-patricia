export type Result = {
  content: GameResult[];
  results: int;
};

type GameResult = {
  uid: string;
  data: Data;
};

type Data = {
  // eslint-disable-next-line camelcase
  display_name: DisplayName[];
};

type DisplayName = {
  text: string;
};

export default function GamingGlobalSearch(
  endpoint: string,
  options: { applicationKey: string; overrideUserAgent?: string },
): {
  searchResults(query: string, localeCode: string, jurisdiction?: string): Promise<Result>;
};
