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
      if (formData.dob && formData.dob.trim()) {
        data.append("dob", formData.dob);
      }
      data.append("gender", formData.gender);
      if (formData.profileFile) data.append("profilePicture", formData.profileFile);

      const response = await updateProfileApi(data); 
      toast.success("Profile perfected");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }

      navigate("/profile", { state: { refresh: true } });
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">

        <div className="md:w-80 flex-shrink-0">
          <HeaderCard />
        </div>

        <div className="flex-1 space-y-12">
          <div className="bg-gray-950 border border-gray-900 p-10">
            <h1 className="text-4xl font-serif font-light tracking-tight italic">Modify Identity</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mt-2">Update your personal archives</p>
          </div>

          <div className="bg-black border border-gray-900 p-10 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-gray-900">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
                <img
                  src={formData.previewImage
                    ? formData.previewImage.startsWith("blob:") 
                    ? formData.previewImage
                    : `${import.meta.env.VITE_API_BASE_URL}${formData.previewImage}?t=${Date.now()}` 
                    : "/src/assets/user.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer inline-block border border-gray-800 text-[10px] uppercase tracking-widest px-6 py-3 hover:border-white transition-all"
                >
                  Acquire New Portrait
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-[9px] text-gray-700 uppercase tracking-widest">Recommended: 1:1 Aspect Ratio</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { name: "username", label: "Username", placeholder: "Enter name" },
                { name: "email", label: "Email Address", type: "email" },
                { name: "phoneNumber", label: "Primary Contact" },
                { name: "dob", label: "Origin Date", type: "date" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-600">{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white outline-none transition-all"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">Gender Identity</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white outline-none transition-all appearance-none"
                >
                  <option value="" className="bg-black">Select Status</option>
                  <option value="Male" className="bg-black">Gentleman</option>
                  <option value="Female" className="bg-black">Lady</option>
                  <option value="Other" className="bg-black">Non-binary</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">Primary Residence</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-12">
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 border border-gray-900 text-[10px] uppercase tracking-[0.2em] py-5 hover:border-white transition-all text-gray-500 hover:text-white"
              >
                Discard Changes
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium py-5 hover:bg-gray-200 transition-all shadow-2xl"
              >
                Commit Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
