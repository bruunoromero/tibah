import { email, envsafe, str } from "envsafe";

export const env = envsafe({
  FIREBASE__PROJECT_ID: str(),
  FIREBASE__PRIVATE_KEY: str(),
  FIREBASE__CLIENT_EMAIL: email(),
  DETA__PROJECT_KEY: str(),
  COOKIE_SECRET_CURRENT: str(),
  COOKIE_SECRET_PREVIOUS: str(),
});
