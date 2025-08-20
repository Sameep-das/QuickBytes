import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Minus, X } from "lucide-react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import { Link } from "react-router-dom";
const cities = ["Mohali", "Kolkata", "Patna", "New Delhi"];

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safe parsing of user from localStorage
  const getUserFromStorage = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const user = location.state?.user || getUserFromStorage() || {};

  const [selectedCity, setSelectedCity] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Redirect if user not found
  useEffect(() => {
    if (!user?.id) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5000/restaurants?city=${selectedCity}`)
        .then((res) => res.json())
        .then((data) => setRestaurants(data))
        .catch((err) => console.error("Error fetching restaurants:", err));
    }
  }, [selectedCity]);

  const handleRestaurantClick = (restaurantId) => {
    fetch(`http://localhost:5000/restaurant-menu/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        const withQuantities = data.map((item) => ({ ...item, quantity: 0 }));
        setMenu(withQuantities);
        setSelectedRestaurant(restaurantId);
      })
      .catch((err) => console.error("Error fetching menu:", err));
  };

  const handleOrder = () => {
    const selectedItems = menu.filter((item) => item.quantity > 0);
    if (selectedItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + (item.quantity || 0) * item.item_price,
      0
    );

    navigate("/order-confirmation", {
      state: {
        userId: user?.id,
        totalAmount,
        city: selectedCity,
        selectedItems,
        selectedRestaurant
      },
    });

    setMenu((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
    setCartOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleHome = () => {
    navigate("/");
  };

  const totalCartItems = menu.filter((i) => i.quantity > 0);
  const cartTotal = totalCartItems.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Navbar */}
      <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">QuickBytes</h1>
        <div className="flex items-center gap-6">
          <span>{user?.name || "User"}</span>
          <button onClick={() => setCartOpen(true)} className="relative">
            <span className="ml-4 text-xl">🛒 {totalCartItems.length}</span>
          </button>
          <button
            onClick={() => navigate("/order-history")}
            className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
          >
            Order History
          </button>
          <button
            onClick={handleHome}
            className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Header: Search + City Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 gap-4 shadow-md">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
        />
        <div>
          <label className="mr-2 font-medium">Select City:</label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
          >
            <option value="">-- Choose --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* City Cards (below dropdown) */}
      
      <div className="mt-24 px-8 md:px-16 xl:px-24 grid grid-cols-1 gap-12 gap-x-12 md:grid-cols-2 xl:grid-cols-4">
        {teamData.map(({ img, name, position, socials }) => (
          <div
            key={name}
            onClick={() => setSelectedCity(name)}
            className={`cursor-pointer flex justify-center`}
          >
            <div className="w-[200px] h-[260px] rounded-xl shadow-lg transition-transform hover:scale-105 bg-white">
              <div className="h-[200px]">
                <TeamCard
                  img={img}
                  name=""
                  position=""
                  socials={socials}
                />
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold text-center">{name}</p>
                <p className="text-xs text-center text-gray-500">{position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Restaurants */}
      {selectedCity && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Restaurants in {selectedCity}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurants
              .filter((rest) =>
                rest.restaurant_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => handleRestaurantClick(rest.id)}
                  className="cursor-pointer p-4 border rounded-md shadow hover:bg-gray-50"
                >
                  <h4 className="font-bold">{rest.restaurant_name}</h4>
                  <p className="text-sm">{rest.location}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Menu with Counter Controls */}
      {menu.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Menu:</h3>
          <ul className="space-y-4">
            {menu.map((item, index) => (
              <li
                key={index}
                className="border p-4 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.item_name}</p>
                  <p className="text-gray-700">₹{item.item_price}</p>
                </div>
                <div className="flex items-center space-x-2 bg-black text-white px-3 py-1 rounded-full">
                  <button
                    onClick={() =>
                      setMenu((prev) =>
                        prev.map((m, i) =>
                          i === index
                            ? { ...m, quantity: Math.max((m.quantity || 0) - 1, 0) }
                            : m
                        )
                      )
                    }
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-2">{item.quantity || 0}</span>
                  <button
                    onClick={() =>
                      setMenu((prev) =>
                        prev.map((m, i) =>
                          i === index
                            ? { ...m, quantity: (m.quantity || 0) + 1 }
                            : m
                        )
                      )
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Total and Order */}
          <div className="mt-6 text-right flex justify-end items-center gap-4">
            <span className="text-xl font-semibold text-black">
              Total: ₹{cartTotal}
            </span>
            <button
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              onClick={handleOrder}
            >
              Order
            </button>
          </div>
        </div>
      )}

      {/* Cart Dialog */}
      {cartOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-start pt-24 z-50">
          <div className="bg-white w-[90%] md:w-[600px] rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-red-500"
              onClick={() => setCartOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">🛒 Your Cart</h2>
            {totalCartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-auto pr-2">
                {totalCartItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{item.item_name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.item_price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Cart Total + Order */}
            {totalCartItems.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-black">
                  Total: ₹{cartTotal}
                </span>
                <button
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                  onClick={handleOrder}
                >
                  Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
