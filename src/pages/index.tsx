import { withPublicPage, withPublicPageSSR } from "~/hoc/auth";

const IndexPage = () => {
  return (
    <div>
      <h1>Index page</h1>
    </div>
  );
};

export default withPublicPage(IndexPage);

export const getServerSideProps = withPublicPageSSR();
