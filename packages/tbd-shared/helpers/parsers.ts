type Parser = (toParse: string) => Map<string, string>;

// Accepts values as key=value; where = and ; can be customized. Ending separator is not obligatory.
// e.g.: key-x_a=value;
export const createKeyValueParser = (attributor: string, separator: string): Parser => {
  const allExceptSelf = `[^${attributor}${separator}]`;
  const keyValueMatcher = new RegExp(`(${allExceptSelf}+)${attributor}([^${separator}]*)(?=${separator}?)`, "g");

  return (toParse: string) => {
    const matches = toParse.replace(/ /g, "").matchAll(keyValueMatcher);

    const entries = [...matches]
      .map((item) => {
        // groups in react-native hermes engine are producing undefined values when using matchAll
        const [, key, value] = item;

        return key ? [key, value] : null;
      })
      .filter((item): item is [string, string] => !!item);

    return new Map<string, string>(entries);
  };
};

export const createHeaderParser = (): Parser => createKeyValueParser(":", ",");
export const createCookieParser = (): Parser => createKeyValueParser("=", ";");
