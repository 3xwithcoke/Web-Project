import React, { useState } from "react";
import toast from 'react-hot-toast';
import { createUserApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
 const navigate = useNavigate(); 
 const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.username) {
      toast.error("Username is required");
      return false;
    }

    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.phoneNumber.trim()){
      toast.error("Phone number is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

  try {
      const dataToSubmit = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
  };
  const response = await createUserApi(dataToSubmit);

      if (response.data.success) {
        toast.success("User registered successfully!");
        navigate("/login")
      } else {
        toast.error("User registration failed");
      }
    } catch (error) {
      console.error("API call error:", error);
  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else if (error.message) {
    toast.error(error.message);
  } else {
      toast.error("Something went wrong");
    }
  }finally{
      setLoading(false);
    }
  };

  return (
     <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-900 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-6 text-center">
            Manage your beauty
          </h1>
          <p className="text-center mb-10">
            Global beauty solutions made simple.
          </p>

          <img
            src="/src/assets/bg.jpg"
            alt="Beauty App"
            className="w-72 md:w-96"
          />
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white rounded-l-3xl shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />
           
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white py-3 rounded-lg hover:opacity-90 transition"
            >
               {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-pink-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
