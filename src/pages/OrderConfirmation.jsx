import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "@/components/Map";

// Safe localStorage parse
const user = (() => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
    return null;
  }
})();

const OrderConfirmation = () => {
  const { state } = useLocation();
  const { userId: initialUserId, totalAmount, city, selectedItems, selectedRestaurant } = state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    buildingNo: "",
    streetName: "",
    city: city || "",
    zipCode: "",
    contact: "",
  });

  useEffect(() => {
    if (initialUserId) {
      setFormData((prev) => ({ ...prev, userId: initialUserId }));
    }
  }, [initialUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { userId, buildingNo, streetName, city, zipCode, contact } = formData;
    if (!userId || !buildingNo || !streetName || !city || !zipCode || !contact) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/save-user-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Unexpected response:", text);
        alert("Unexpected response from server. Check console for details.");
        return;
      }
      const data = await response.json();
      if (response.ok) {
        alert("Details saved! Proceeding to payment...");
        handlePayment();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      alert("Failed to connect to server.");
    }
  };

  const handlePayment = async () => {
    try {
      // Log initial data
      console.log('Initial data:', {
        initialUserId,
        selectedRestaurant,
        totalAmount,
        selectedItems
      });

      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is missing');
      }

      if (!initialUserId) {
        throw new Error('User ID is missing');
      }

      if (!totalAmount || totalAmount <= 0) {
        throw new Error('Invalid total amount');
      }

      if (!selectedItems || selectedItems.length === 0) {
        throw new Error('No items selected');
      }

      const options = {
        key: "rzp_test_duBHikfomdyNaa",
        amount: totalAmount * 100,
        currency: "INR",
        name: "QuickBytes",
        description: "Food Order Payment",
        handler: async function (response) {
          try {
            console.log('Payment successful, processing order...');
            console.log('Selected items:', selectedItems);

            const processedItems = selectedItems.map(item => {
              const processedItem = {
                item_name: item.name || item.item_name,
                quantity: parseInt(item.quantity) || 1,
                price: parseFloat(item.price || item.item_price) || 0
              };
              console.log('Processed item:', processedItem);
              return processedItem;
            });

            const orderData = {
              userId: parseInt(initialUserId),
              restaurantId: parseInt(selectedRestaurant),
              totalAmount: parseFloat(totalAmount),
              items: processedItems
            };

            console.log('Sending order data:', JSON.stringify(orderData, null, 2));

            const orderResponse = await fetch("http://localhost:5000/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderData),
            });

            if (!orderResponse.ok) {
              const errorData = await orderResponse.json();
              console.error('Server error:', errorData);
              throw new Error(errorData.message || 'Server returned an error');
            }

            const responseData = await orderResponse.json();
            console.log('Server response:', responseData);

            alert("Order placed successfully!");
            navigate("/order-history");
          } catch (error) {
            console.error("Error in payment handler:", {
              name: error.name,
              message: error.message,
              stack: error.stack
            });
            alert(error.message || "Failed to save order. Please try again.");
          }
        },
        prefill: {
          contact: formData.contact,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function() {
            console.log('Checkout form closed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error("Error in handlePayment:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      alert(error.message || "Failed to process order. Please try again.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-lg flex gap-8">
        {/* Map Section */}
        <div className="w-1/2">
          <Map />
        </div>

        {/* Address Form Section */}
        <div className="w-1/2">
          <button
            onClick={() =>
              navigate("/user-dashboard", {
                state: { user },
              })
            }
            className="mb-6 text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">Delivery Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Building No:</label>
            <input
              type="text"
              name="buildingNo"
              value={formData.buildingNo}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="e.g. 12A"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Street Name:</label>
            <input
              type="text"
              name="streetName"
              value={formData.streetName}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="e.g. Park Street"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              readOnly
              className="w-full border p-2 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Zip Code:</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="e.g. 110001"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Contact Number:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              placeholder="e.g. 9876543210"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Continue to Pay ₹{totalAmount ? totalAmount : "0"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
