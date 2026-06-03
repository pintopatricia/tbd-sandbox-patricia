const styles = require("./UserProfileHeader.web.modules.json");

const USER_PROFILE_HEADER = styles.header;
const TITLE = `${USER_PROFILE_HEADER} ${styles.title}`;
const CLOSE = `${USER_PROFILE_HEADER} ${styles.closeIconContainer}`;
const BACK = `${USER_PROFILE_HEADER} ${styles.backIconContainer}`;
const BALANCE = `${USER_PROFILE_HEADER} ${styles.balanceLabel}`;
const FREE_BETS_BALANCE = `${USER_PROFILE_HEADER} ${styles.freeBetsBalanceLabel}`;

module.exports = {
  USER_PROFILE_HEADER,
  TITLE,
  CLOSE,
  BACK,
  BALANCE,
  FREE_BETS_BALANCE,
};
