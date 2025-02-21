import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";
import { MdError } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useTheme } from "../providers/ThemeProvider";

export default function Login() {
  const { setUser, googleLogIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleLogIn = () => {
    googleLogIn()
      .then((result) => {
        const user = result.user;
        setUser(user);
        axiosPublic
          .post("/users", {
            email: user?.email,
            name: user?.displayName,
            photoUrl: user?.photoURL,
          })
          .then((response) => {
            if (response?.data?.insertedId) {
              toast.success("Login successful!");
            }
          });
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        setError(error.code);
      });
  };

  return (
    <>
      <Helmet>
        <title>TMS | Login</title>
      </Helmet>
      <section className="mx-auto flex min-h-screen w-11/12 max-w-screen-xl items-center justify-center py-8">
        <div className="mx-auto flex w-full max-w-md items-center justify-center">
          <div className="w-full rounded-lg border p-8 dark:border-gray-700">
            {theme === "dark" ? (
              <img
                onClick={() => navigate("/")}
                className="mx-auto mb-4 h-16 w-16 cursor-pointer"
                src="/tms-white.png"
                alt="Logo"
              />
            ) : (
              <img
                onClick={() => navigate("/")}
                className="mx-auto mb-4 h-16 w-16 cursor-pointer"
                src="/tms-black.png"
                alt="Logo"
              />
            )}
            <h1 className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
              Welcome to TMS
            </h1>

            <button
              onClick={handleGoogleLogIn}
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-black p-2 font-semibold focus:scale-95 dark:border-white"
            >
              <FaGoogle /> Continue with Google
            </button>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <div>
                  <MdError />
                </div>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
