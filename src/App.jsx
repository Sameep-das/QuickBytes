import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";


function App() {
  const { pathname } = useLocation();

  const hideNavbarRoutes = [
    "/sign-in",
    "/sign-up",
    "/restaurant-signup",
    "/restaurant-dashboard",
    "/user-dashboard",
    "/order-confirmation",
    "/order-history"
  ];
  const role = localStorage.getItem("role");
const profilePath =
  role === "user"
    ? "/user-dashboard"
    : role === "restaurant"
    ? "/restaurant-dashboard"
    : "/";

  return (
    <>
      {!hideNavbarRoutes.includes(pathname) && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          

      <Navbar routes={[
         { name: "Home", path: "/" },
        { name: "Profile", path: profilePath },
        ]}
      />

        </div>
      )}

      <Routes>
        {routes.map(
          ({ path, element }, key) =>
            element && <Route key={key} exact path={path} element={element} />
        )}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
