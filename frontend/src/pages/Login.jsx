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
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
      toast.success(response.data.message || "Login successful");

      const decoded = jwtDecode(response.data.token);

      // Fetch and store complete profile after login
      try {
        const profileRes = await getProfileApi();
        console.log("Profile response:", profileRes.data);
        
        if (profileRes.data) {
          // Store the entire profile data or extract specific fields
          const profileData = profileRes.data.user || {
            user_id: profileRes.data.user_id,
            username: profileRes.data.username,
            email: profileRes.data.email,
            profilePicture: profileRes.data.profilePicture || "",
          };
          localStorage.setItem("user", JSON.stringify(profileData));
          console.log("Profile stored in localStorage:", profileData);
          
          // Dispatch event to trigger HeaderCard/AdminCard update
          window.dispatchEvent(new Event("userUpdated"));
        }
      } catch (profileError) {
        console.error("Failed to fetch profile:", profileError?.response?.data || profileError);
        // Continue with login even if profile fetch fails
      }

      window.dispatchEvent(new Event("userLogin"));

      if (decoded.role === "admin") {
        // Add small delay to ensure localStorage is updated and event is captured
        setTimeout(() => {
          navigate("/admindash", { replace: true });
        }, 100);
      } else {
        navigate("/userdash", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-900 text-white flex flex-col justify-center items-center p-10 relative">
        <h1 className="text-4xl font-bold mb-6 text-center">Manage your beauty</h1>
        <p className="text-center mb-10">Global beauty solutions made simple</p>
        <img
          src="\src\assets\bg.jpg"
          alt="App preview"
          className="w-72 md:w-96"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white rounded-l-3xl shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold mb-6">Sign In</h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="text-right">
              <a href="/forgotpassword" className="text-pink-500 hover:underline text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

         <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            New here?{" "}
            <Link
              to="/register"
              className="text-pink-500 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
