import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../providers/ThemeProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const { user, logOut } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-white py-4 dark:border-gray-700 dark:bg-black">
        <div className="mx-auto flex w-11/12 max-w-screen-xl items-center justify-between">
          <section className="flex items-center justify-center gap-2">
            {theme === "dark" ||
            (theme === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
              <img
                onClick={() => navigate("/")}
                className="h-9 w-9 cursor-pointer"
                src="/tms-white.png"
                alt=""
              />
            ) : (
              <img
                onClick={() => navigate("/")}
                className="h-9 w-9 cursor-pointer"
                src="/tms-black.png"
                alt=""
              />
            )}

            <h3
              onClick={() => navigate("/")}
              className="cursor-pointer text-2xl font-semibold sm:text-3xl"
            >
              TMS
            </h3>
          </section>
          <section className="flex items-center gap-6">
            <ThemeToggle />
            <div
              ref={dropdownButtonRef}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="relative block h-9 w-9 cursor-pointer rounded-full"
            >
              <img
                className="h-9 w-9 cursor-pointer rounded-full border"
                src={user?.photoURL}
                alt=""
                referrerPolicy="no-referrer"
              />
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-12 flex min-w-56 flex-col rounded-lg border bg-white py-2 dark:border-gray-700 dark:bg-black"
                >
                  <p className="px-4 py-3 font-semibold">{user?.displayName}</p>
                  <hr className="dark:border-gray-700" />
                  {/* <Link
                    to="/activity-log"
                    className="mt-2 px-4 py-2 hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                  >
                    Activity Log
                  </Link> */}
                  <button
                    onClick={logOut}
                    className="px-4 py-2 text-left hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </nav>
    </>
  );
}
