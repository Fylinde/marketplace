import { Link } from "react-router-dom";
import Layout from "../components/layout/AppLayout";

const AboutPage = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link to="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
);

export default AboutPage;
