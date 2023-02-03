import { GetServerSideProps } from "next";
import { AuthAction, withAuthUser, withAuthUserSSR } from "next-firebase-auth";

export const withPublicPage = withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
});

export const withPrivatePage = withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
});

export const withPublicPageSSR = (func?: GetServerSideProps) =>
  withAuthUserSSR({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
  })(func);

export const withPrivatePageSSR = (func?: GetServerSideProps) =>
  withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(func);
