import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminCard from "../component/dashboard/AdminCard";
import { getProfileApi, updateProfileApi } from "../services/api";

const AdminEditProfile = () => {
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
    const localUser = JSON.parse(localStorage.getItem("user")) || {};

    if (initialData) {
      setFormData({
        ...initialData,
        profileFile: null,
        previewImage: initialData.profilePicture || localUser.profilePicture || "",
        username: initialData.username || localUser.username || "",
        email: initialData.email || localUser.email || "",
        phoneNumber: initialData.phoneNumber || "",
        address: initialData.address || "",
        dob: initialData.dob || "",
        gender: initialData.gender || "",
      });
    } else if (localUser) {
      const fetchProfile = async () => {
        try {
          const { data } = await getProfileApi();
          setFormData({
            ...data,
            profileFile: null,
            previewImage: data.profilePicture || localUser.profilePicture || "",
            username: data.username || localUser.username || "",
            email: data.email || localUser.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            dob: data.dob || "",
            gender: data.gender || "",
          });
        } catch (error) {
          toast.error("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
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
      data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      if (formData.profileFile) data.append("profilePicture", formData.profileFile);

      const response = await updateProfileApi(data);
      toast.success(response.data.message || "Profile updated!");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }

      navigate("/adminprofile", { state: { refresh: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("UPDATE PROFILE ERROR:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">

        <div className="md:w-1/4">
          <AdminCard />
        </div>

        <div className="md:w-3/4 space-y-6">

          <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold">Edit Personal Information</h1>
            <p className="opacity-90">Update your details</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">

            <div className="mb-6 flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
                <img
                  src={
                    formData.previewImage
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
              {[
                { label: "Username", name: "username" },
                { label: "Email", name: "email" },
                { label: "Phone Number", name: "phoneNumber" },
                { label: "Date of Birth", name: "dob", type: "date" },
                { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"] },
                { label: "Address", name: "address", type: "text", full: true },
              ].map((field) => (
                <div key={field.name} className={field.full ? "md:col-span-2" : ""}>
                  <label className="text-gray-500 text-sm mb-1 block">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => navigate("/adminprofile")}
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

export default AdminEditProfile;
