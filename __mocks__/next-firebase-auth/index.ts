import { testContext } from "__utils__/test-context";

export const verifyIdToken = jest.fn(() => {
  if (!testContext.currentUser) throw new Error();

  return testContext.currentUser;
});

export const getUserFromCookies = jest.fn(() => {
  if (!testContext.currentUser) throw new Error();

  return testContext.currentUser;
});
