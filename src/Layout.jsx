import { Helmet } from "react-helmet-async";
import Navbar from "./components/Navbar";
import App from "./pages/App";

export default function Layout() {
  return (
    <>
      <Helmet>
        <title>TMS</title>
      </Helmet>
      <Navbar />
      <App />
    </>
  );
}
