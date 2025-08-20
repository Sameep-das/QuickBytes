import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar as MTNavbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const isRestaurantSignup = location.pathname === "/Restaurantsignup";

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    });
  }, []);

  const toggleDropdown = (dropdownType) => {
    setOpenDropdown((prev) => (prev === dropdownType ? null : dropdownType));
  };

  const filteredRoutes = Array.isArray(routes)
    ? routes.filter(
        (route) =>
          route.name?.toLowerCase() !== "restaurant signup" &&
          route.name?.toLowerCase() !== "restaurant dashboard" &&
          route.name?.toLowerCase() !== "order confirmation"
      )
    : [];

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {filteredRoutes.map(({ name, path, icon, href, target }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="white"
          className="capitalize text-white"
        >
          {href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-1 font-bold text-white hover:text-white"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-1 font-bold text-white hover:text-white"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );

  return (
    <MTNavbar
      color="transparent"
      className={`p-3 shadow-md ${
        isRestaurantSignup ? "bg-black text-white" : "bg-transparent text-white"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold text-white">
            {brandName}
          </Typography>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navList}

          {/* Sign Up Dropdown - Click based */}
          <div className="relative">
            <button
              className="text-white font-medium"
              onClick={() => toggleDropdown("signup")}
            >
              Sign Up
            </button>
            {openDropdown === "signup" && (
              <ul className="absolute z-10 mt-2 bg-white text-black rounded-md shadow-md py-2 w-44">
                <li>
                  <Link to="/sign-up" className="block px-4 py-2 hover:bg-gray-200">Customer</Link>
                </li>
                <li>
                  <Link to="/restaurant-signup" className="block px-4 py-2 hover:bg-gray-200">Restaurant</Link>
                </li>
                <li>
                  <Link to="/partnersignup" className="block px-4 py-2 hover:bg-gray-200">Del Partner</Link>
                </li>
              </ul>
            )}
          </div>

          {/* Sign In Dropdown - Click based */}
          <div className="relative">
            <button
              className="text-white font-medium"
              onClick={() => toggleDropdown("signin")}
            >
              Sign In
            </button>
            {openDropdown === "signin" && (
              <ul className="absolute z-10 mt-2 bg-white text-black rounded-md shadow-md py-2 w-44">
                <li>
                  <Link to="/sign-in" className="block px-4 py-2 hover:bg-gray-200">Customer</Link>
                </li>
                <li>
                  <Link to="/sign-in" className="block px-4 py-2 hover:bg-gray-200">Restaurant</Link>
                </li>
                <li>
                  <Link to="/partnersignin" className="block px-4 py-2 hover:bg-gray-200">Del Partner</Link>
                </li>
              </ul>
            )}
          </div>

          <a href="#" target="_blank">
            <Button variant="text" size="sm" color="white" className="text-white" fullWidth>
              pro version
            </Button>
          </a>

          {React.cloneElement(action, {
            className: "hidden lg:inline-block text-white",
          })}
        </div>

        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Nav */}
      <MobileNav
        className={`rounded-xl px-4 pt-2 pb-4 ${
          isRestaurantSignup ? "bg-black text-white" : "bg-black text-white"
        }`}
        open={openNav}
      >
        <div className="container mx-auto">
          {navList}
          <div className="my-2 space-y-2">
            <Typography variant="small" className="font-bold text-white">Sign Up</Typography>
            <Link to="/signup" className="block px-2 py-1 text-white">Customer</Link>
            <Link to="/Restaurantsignup" className="block px-2 py-1 text-white">Restaurant</Link>
            <Link to="/partnersignup" className="block px-2 py-1 text-white">Del Partner</Link>

            <Typography variant="small" className="mt-4 font-bold text-white">Sign In</Typography>
            <Link to="/signin" className="block px-2 py-1 text-white">Customer</Link>
            <Link to="/restaurant-signin" className="block px-2 py-1 text-white">Restaurant</Link>
            <Link to="/partnersignin" className="block px-2 py-1 text-white">Del Partner</Link>
          </div>

          <a href="#" target="_blank" className="mb-2 block">
            <Button variant="text" size="sm" className="text-white" fullWidth>
              pro version
            </Button>
          </a>

          {React.cloneElement(action, {
            className: "w-full block text-white",
          })}
        </div>
      </MobileNav>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "Quick Bytes",
  routes: [],
  action: (
    <a href="#" target="_blank">
      <Button variant="gradient" size="sm" fullWidth>
        Settings
      </Button>
    </a>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
