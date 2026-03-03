import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfileApi, updateProfileApi } from "../services/api";
import toast from "react-hot-toast";
import HeaderCard from "../component/dashboard/HeaderCard";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state?.initialData;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
    profileFile: null,     
    previewImage: "",      
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        profileFile: null,
        previewImage: initialData.profilePicture || "",
      }));
    } else {
      const fetchProfile = async () => {
        try {
          const { data } = await getProfileApi();
          setFormData(prev => ({
            ...prev,
            ...data,
            profileFile: null,
            previewImage: data.profilePicture || "",
          }));
        } catch (error) {
          toast.error("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      profileFile: file,
      previewImage: URL.createObjectURL(file), 
    }));
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("address", formData.address);
      // Only append dob if it has a value
      if (formData.dob && formData.dob.trim()) {
        data.append("dob", formData.dob);
      }
      data.append("gender", formData.gender);
      if (formData.profileFile) data.append("profilePicture", formData.profileFile);

      const response = await updateProfileApi(data); 
      toast.success(response.data.message || "Profile updated!");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }

      navigate("/profile", { state: { refresh: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("UPDATE PROFILE ERROR:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <div className="md:w-1/4">
          <HeaderCard />
        </div>

        <div className="md:w-3/4 space-y-6">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold">Edit Personal Information</h1>
            <p className="opacity-90">Update your details</p>
          </div>
          <div className="bg-white rounded 2xl shadow-md p-8">
          <div className= "flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>

          <div className="mb-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
              <img
              src={formData.previewImage
                ? formData.previewImage.startsWith("blob:") 
                ? formData.previewImage
                : `${import.meta.env.VITE_API_BASE_URL}${formData.previewImage}?t=${Date.now()}` 
                : "/src/assets/user.png"
              }
              alt={formData.username || "Profile"}
              className="w-full h-full object-cover rounded-full"
              />
            </div>

            <label
              htmlFor="profilePicture"
              className="cursor-pointer bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md select-none"
            >
              Change Picture
            </label>

            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="text-gray-500 text-sm mb-1 block">👤 Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">📧 Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">📞 Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">🎂 Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">⚧ Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-500 text-sm mb-1 block">📍 Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl py-3 hover:brightness-110 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
  );
};

export default EditProfile;
