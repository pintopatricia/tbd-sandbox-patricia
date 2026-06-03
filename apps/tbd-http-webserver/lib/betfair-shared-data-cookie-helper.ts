export default (isLoggedIn: boolean, cookieValue?: string): { value?: string; expires?: Date; changed?: boolean } => {
  const PROSPECT = "p";
  const REGISTERED = "reg";
  const RETURNING_PROSPECT = "rp";
  const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 86_400_000;
  const currentTimestamp = new Date().getTime();
  const ONE_YEAR_FROM_NOW = new Date();
  ONE_YEAR_FROM_NOW.setFullYear(ONE_YEAR_FROM_NOW.getFullYear() + 1);

  const bfsdCookie = (sessionType: string) => ({
    value: `ts=${currentTimestamp}|st=${sessionType}`,
    expires: ONE_YEAR_FROM_NOW,
    changed: true,
  });

  if (!cookieValue) {
    return bfsdCookie(PROSPECT);
  }

  const [cookieTimestamp, cookieSessionType] = cookieValue.split("|");
  const timestamp = cookieTimestamp.substring(3);
  const sessionType = cookieSessionType.substring(3);

  if (isLoggedIn && sessionType !== REGISTERED) {
    return bfsdCookie(REGISTERED);
  }

  if (sessionType === PROSPECT && currentTimestamp - parseInt(timestamp, 10) > TWENTY_FOUR_HOURS_IN_MILLISECONDS) {
    return bfsdCookie(RETURNING_PROSPECT);
  }

  return { changed: false };
};
