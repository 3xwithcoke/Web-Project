import React, { useState } from "react";
import toast from 'react-hot-toast';
import { createUserApi } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

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
    if (!formData.username) return toast.error("Username is required") && false;
    if (!formData.email) return toast.error("Email is required") && false;
    if (!formData.password) return toast.error("Password is required") && false;
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters long") && false;
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match") && false;
    if (!formData.phoneNumber.trim()) return toast.error("Phone number is required") && false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await createUserApi(formData);
      if (response.data.success) {
        toast.success("Welcome to the legacy");
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <div className="hidden lg:flex flex-1 bg-gray-950 flex-col justify-center items-center p-20 relative border-r border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black z-0 opacity-60"></div>
        <img
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000&auto=format&fit=crop"
          alt="Luxury Watch"
          className="w-full h-full object-cover absolute inset-0 z-[-1] grayscale opacity-30"
        />
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-6xl font-serif font-light tracking-tighter italic">Chronos Luxe</h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-xs">Crafting Time, Defining Style</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-black">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-light tracking-tight">Join the Legacy</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-light">Create an account to begin your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "username", placeholder: "Full Name", type: "text" },
              { name: "email", placeholder: "Email Address", type: "email" },
              { name: "password", placeholder: "Secret Code", type: "password" },
              { name: "confirmPassword", placeholder: "Confirm Code", type: "password" },
              { name: "address", placeholder: "Delivery Residence", type: "text" },
              { name: "phoneNumber", placeholder: "Primary Contact", type: "text" },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-900 rounded-none px-4 py-3 text-sm focus:border-white transition-colors outline-none placeholder:text-gray-700"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 font-medium uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all duration-500 shadow-2xl mt-8"
            >
               {loading ? "Joining..." : "Create Heritage Account"}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline underline-offset-4 ml-2">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
