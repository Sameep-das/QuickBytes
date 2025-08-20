import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";

const Restaurantsignup = () => {
  const [formData, setFormData] = useState({
    restaurant_name: "",
    owner_name: "",
    email: "",
    location: "Mohali",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (value) => {
    setFormData({ ...formData, location: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      restaurant_name,
      owner_name,
      email,
      location,
      password,
      confirm_password,
    } = formData;

    if (
      !restaurant_name ||
      !owner_name ||
      !email ||
      !location ||
      !password ||
      !confirm_password
    ) {
      alert("Please fill all the fields.");
      return;
    }

    if (password !== confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/restaurant-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_name,
          owner_name,
          email,
          location,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("restaurantId", data.restaurantId);
        localStorage.setItem("role", "restaurant");
        navigate("/restaurant-dashboard", {
          state: { ...formData, restaurantId: data.restaurantId },
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Register Your Restaurant
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your restaurant details to get started.
          </Typography>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Restaurant Name
            </Typography>
            <Input
              name="restaurant_name"
              value={formData.restaurant_name}
              onChange={handleChange}
              size="lg"
              placeholder="Your Restaurant Name"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Owner Name
            </Typography>
            <Input
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              size="lg"
              placeholder="Restaurant Owner Name"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Email Address
            </Typography>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Restaurant Location
            </Typography>
            <Select
              value={formData.location}
              onChange={handleLocationChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            >
              <Option value="Mohali">Mohali</Option>
              <Option value="Kolkata">Kolkata</Option>
              <Option value="Patna">Patna</Option>
              <Option value="New Delhi">New Delhi</Option>
            </Select>
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirm Password
            </Typography>
            <Input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Register Restaurant
          </Button>

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Already have an account?
            <Link to="/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
};

export default Restaurantsignup;
