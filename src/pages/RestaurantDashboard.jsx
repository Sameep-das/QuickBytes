import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([{ name: "", price: "" }]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("restaurantId");

    if (!storedId) {
      navigate("/restaurant-signup");
      return;
    }

    const fetchRestaurantDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/restaurant/${storedId}`);
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        navigate("/restaurant-signup");
      }
    };

    fetchRestaurantDetails();
  }, [navigate]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  const handleAddItem = () => {
    if (menuItems.length < 10) {
      setMenuItems([...menuItems, { name: "", price: "" }]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/restaurant-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: localStorage.getItem("restaurantId"),
          menuItems,
        }),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save menu.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurantId");
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };

  if (!restaurant) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8">
      <div className="bg-black text-white p-6 rounded-xl shadow-xl w-full max-w-3xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Restaurant Dashboard</h2>
          <div className="flex gap-3">
            <button
              onClick={goHome}
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
        <p className="mb-1"><strong>Name:</strong> {restaurant.restaurant_name}</p>
        <p className="mb-1"><strong>Owner:</strong> {restaurant.owner_name}</p>
        <p className="mb-1"><strong>Location:</strong> {restaurant.location}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl">
        <h3 className="text-2xl font-semibold mb-4">Add Menu Items (max 10)</h3>
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              className="p-3 border border-gray-300 rounded-md w-full"
              required
            />
            <input
              type="number"
              placeholder="Item Price"
              value={item.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
              className="p-3 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-4 mt-4">
          <button
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Item
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Submit Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
