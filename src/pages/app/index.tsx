import { useAuthUser } from "next-firebase-auth";
import { useEffect } from "react";
import { withPrivatePage, withPrivatePageSSR } from "~/hoc/auth";
import { trpc } from "~/utils/trpc";

const AppPage = () => {
  const user = useAuthUser();

  useEffect(() => {
    user.getIdToken().then(console.log);
  }, [user]);

  // if (!result.data) return null;

  return (
    <div>
      <span>ola</span>
    </div>
  );
};

export const getServerSideProps = withPrivatePageSSR();

export default withPrivatePage(AppPage);
