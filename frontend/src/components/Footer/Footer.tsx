import { LazyLoadImage } from "react-lazy-load-image-component";
import fourLogo from "../../Assets/fourlogo.png";
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="m-4 bg-white rounded-lg shadow dark:bg-gray-900">
      <div className="w-full max-w-screen-xl p-4 mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 space-x-3 sm:mb-0 rtl:space-x-reverse"
          >
            <LazyLoadImage src={fourLogo} className="h-8" />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <NavLink to="/" className="hover:underline me-4 md:me-6">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="" className="hover:underline me-4 md:me-6">
                Locate Branch
              </NavLink>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <NavLink to="/" className="hover:underline">
            FOUR™
          </NavLink>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
