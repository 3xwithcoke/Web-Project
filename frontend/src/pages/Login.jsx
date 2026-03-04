import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, getProfileApi } from "../services/api"; 
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await loginUser(formData);
      if (!response?.data?.token) {
        return toast.error(response?.data?.message || "Login failed");
      }

      localStorage.setItem("token", response.data.token);
      toast.success(response.data.message || "Welcome back");

      const decoded = jwtDecode(response.data.token);

      try {
        const profileRes = await getProfileApi();
        if (profileRes.data) {
          const profileData = profileRes.data.user || {
            user_id: profileRes.data.user_id,
            username: profileRes.data.username,
            email: profileRes.data.email,
            profilePicture: profileRes.data.profilePicture || "",
          };
          localStorage.setItem("user", JSON.stringify(profileData));
          window.dispatchEvent(new Event("userUpdated"));
        }
      } catch (profileError) {
        console.error("Failed to fetch profile:", profileError);
      }

      window.dispatchEvent(new Event("userLogin"));

      if (decoded.role === "admin") {
        setTimeout(() => navigate("/admindash", { replace: true }), 100);
      } else {
        navigate("/userdash", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <div className="hidden lg:flex flex-1 bg-gray-950 flex-col justify-center items-center p-20 relative border-r border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black z-0 opacity-60"></div>
        <img
          src="https://images.unsplash.com/photo-1508685096489-77a46807e624?q=80&w=1000&auto=format&fit=crop"
          alt="Luxury Watch"
          className="w-full h-full object-cover absolute inset-0 z-[-1] grayscale opacity-30"
        />
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-6xl font-serif font-light tracking-tighter italic">Chronos Luxe</h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-xs">Excellence in every second</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-black">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-light tracking-tight">Sign In</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-light">Enter your credentials to access your collection</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-900 rounded-none px-4 py-4 text-sm focus:border-white transition-colors outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-900 rounded-none px-4 py-4 text-sm focus:border-white transition-colors outline-none"
                required
              />
            </div>

            <div className="text-right">
              <Link to="/forgotpassword" weight="light" className="text-gray-500 hover:text-white transition text-[10px] uppercase tracking-widest">
                Forgot heritage?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black py-4 font-medium uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all duration-500 shadow-2xl"
            >
              Enter Vault
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">
              New to the legacy?{" "}
              <Link to="/register" className="text-white hover:underline underline-offset-4 ml-2">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
