const TEST_ID = "[id=content-login]";
const HEADER = `${TEST_ID} > [id=header-placeholder]`;
const CONTENT = `${TEST_ID} > [class$=contentShadow]`;
const LOGIN_FORM = `${CONTENT} [class$=mod-login-login]`;

module.exports = {
  TEST_ID,
  HEADER,
  LOGIN_FORM,
  LOGIN_USERNAME: `${LOGIN_FORM} [id=username]`,
  LOGIN_PASSWORD: `${LOGIN_FORM} [id=password]`,
  LOGIN_BUTTON: `${LOGIN_FORM} [class$=loginButton]`,
};
