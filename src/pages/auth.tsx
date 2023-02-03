import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ComponentType } from "react";
import { withPublicPage, withPublicPageSSR } from "~/hoc/auth";

const AuthPage: ComponentType<unknown> = () => {
  return (
    <button
      onClick={() => {
        signInWithPopup(getAuth(), new GoogleAuthProvider());
      }}
    >
      login with google
    </button>
  );
};

export const getServerSideProps = withPublicPageSSR();

export default withPublicPage(AuthPage);
