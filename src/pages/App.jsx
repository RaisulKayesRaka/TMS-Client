import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";

export default function App() {
  return (
    <>
      <Helmet>
        <title>TMS</title>
      </Helmet>
      <Navbar />
    </>
  );
}
