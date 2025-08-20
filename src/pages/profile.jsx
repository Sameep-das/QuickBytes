import { Avatar, Typography, Button } from "@material-tailwind/react";
import {
  MapPinIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/solid";
import { Footer } from "@/widgets/layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      console.log("Profile component mounted");
      
      // Get all localStorage items for debugging
      const allStorage = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allStorage[key] = localStorage.getItem(key);
      }
      console.log("All localStorage items:", allStorage);

      // Check if user is logged in
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const restaurantId = localStorage.getItem("restaurantId");
      const role = localStorage.getItem("role");

      console.log("Parsed auth data:", { 
        user, 
        restaurantId, 
        role,
        hasUser: !!user,
        hasRestaurantId: !!restaurantId,
        hasRole: !!role
      });

      if (role === "restaurant" && restaurantId) {
        console.log("Redirecting to restaurant dashboard");
        navigate("/restaurant-dashboard");
      } else if (role === "user" && user?.id) {
        console.log("Redirecting to user dashboard");
        navigate("/user-dashboard");
      } else if (role === "delivery" && user?.id) {
        console.log("Redirecting to delivery dashboard");
        navigate("/delivery-dashboard");
      } else {
        console.log("No valid auth found, redirecting to home");
        navigate("/");
      }
    } catch (error) {
      console.error("Error in Profile component:", error);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Typography variant="h4" color="blue-gray">
        Redirecting...
      </Typography>
    </div>
  );
}

export default Profile;
