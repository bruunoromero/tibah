import { withPrivatePage, withPrivatePageSSR } from "~/hoc/auth";
import { trpc } from "~/utils/trpc";

export const SettingsPage = () => {
  const utils = trpc.useContext();
  const { data } = trpc.auth.apikey.get.useQuery();
  const createApikey = trpc.auth.apikey.create.useMutation({
    onSuccess() {
      utils.auth.apikey.get.invalidate();
    },
  });

  return (
    <div>
      <button onClick={() => createApikey.mutate()}>create api key</button>
      <h1>{data?.token || "no token"}</h1>
    </div>
  );
};

export const getServerSideProps = withPrivatePageSSR();

export default withPrivatePage(SettingsPage);
