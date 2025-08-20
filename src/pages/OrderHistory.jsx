import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@material-tailwind/react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "amber";
      case "confirmed":
        return "blue";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      navigate("/sign-in");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;
      
      const response = await axios.get(`${API_BASE_URL}/orders/${user.id}`);
      console.log('Fetched orders:', response.data);
      
      // Ensure each order has a status
      const ordersWithStatus = response.data.map(order => ({
        ...order,
        status: order.status || 'pending' // Default to pending if status is missing
      }));
      
      setOrders(ordersWithStatus);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      console.log('Attempting to cancel order:', orderId);
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`);
      console.log('Cancel response:', response.data);
      if (response.status === 200) {
        // Update the order status in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        alert('Order cancelled successfully!');
      }
    } catch (error) {
      console.error('Error canceling order:', error.response?.data || error);
      alert(error.response?.data?.error || 'Failed to cancel order. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h6">Loading orders...</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h3" className="font-bold">
            Order History
          </Typography>
          <Button
            onClick={() => navigate("/user-dashboard")}
            variant="outlined"
            color="gray"
          >
            Back to Dashboard
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="mt-6">
            <CardBody className="text-center">
              <Typography>No orders found.</Typography>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              console.log('Rendering order:', {
                id: order.id,
                status: order.status,
                items: order.items
              });
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardBody>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Typography variant="h6">
                          Order #{order.id}
                        </Typography>
                        <Typography color="gray" className="mt-1">
                          Placed on: {formatDate(order.order_date)}
                        </Typography>
                        {order.delivery_date && (
                          <Typography color="gray" className="mt-1">
                            Delivered on: {formatDate(order.delivery_date)}
                          </Typography>
                        )}
                      </div>
                      <Chip
                        value={order.status}
                        color={getStatusColor(order.status)}
                      />
                    </div>

                    <div className="border-t border-b py-4 my-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <Typography>
                            {item.item_name} x {item.quantity}
                          </Typography>
                          <Typography>₹{item.price * item.quantity}</Typography>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <Typography variant="h6">
                        Total Amount: ₹{order.total_amount}
                      </Typography>
                    </div>
                  </CardBody>
                  <CardFooter className="pt-0">
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <Button
                        color="red"
                        onClick={() => handleCancel(order.id)}
                        fullWidth
                      >
                        Cancel Order
                      </Button>
                    )}
                    {order.status === "cancelled" && (
                      <Typography color="red" className="text-center">
                        Order Cancelled
                      </Typography>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 