import { Home, Profile, SignIn, SignUp } from "@/pages";
import Restaurantsignup from "@/pages/Restaurantsignup";
import RestaurantDashboard from "@/pages/RestaurantDashboard";
import UserDashboard from "@/pages/UserDashboard";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderHistory from "@/pages/OrderHistory";


export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "Sign In",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    name: "Sign Up",
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    name: "Restaurant Signup",
    path: "/restaurant-signup",
    element: <Restaurantsignup />,
  },
  {
    name: "Restaurant Dashboard",
    path: "/restaurant-dashboard",
    element: <RestaurantDashboard />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    name: "Order Confirmation",
    path: "/order-confirmation",
    element: <OrderConfirmation />,
  },
  {
    name: "Order History",
    path: "/order-history",
    element: <OrderHistory />,
  },
];

export default routes;
