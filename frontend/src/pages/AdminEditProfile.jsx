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
    } else {
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
      if (formData.dob) data.append("dob", formData.dob);
      data.append("gender", formData.gender);
      if (formData.profileFile) data.append("profilePicture", formData.profileFile);

      const response = await updateProfileApi(data);
      toast.success("Security credentials updated");

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }

      navigate("/adminprofile", { state: { refresh: true } });
    } catch (error) {
      toast.error("Failed to update executive archives");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="md:w-80 flex-shrink-0">
          <AdminCard />
        </div>

        <div className="flex-1 space-y-12">
          <div className="bg-gray-950 border border-gray-900 p-10">
            <h1 className="text-4xl font-serif font-light tracking-tight italic">Modify Credentials</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 mt-2">Executive Archive Access</p>
          </div>

          <div className="bg-black border border-gray-900 p-10 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-gray-900">
              <div className="w-32 h-32 bg-gray-900 border border-gray-800 overflow-hidden">
                <img
                  src={
                    formData.previewImage
                      ? formData.previewImage.startsWith("blob:")
                        ? formData.previewImage
                        : `${import.meta.env.VITE_API_BASE_URL}${formData.previewImage}?t=${Date.now()}`
                      : "/src/assets/user.png"
                  }
                  alt="Executive"
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { label: "Identity Name", name: "username" },
                { label: "Authorized Email", name: "email", type: "email" },
                { label: "Direct Channel", name: "phoneNumber" },
                { label: "Origin Date", name: "dob", type: "date" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-600">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white outline-none transition-all"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">Executive Status</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-900 py-3 text-sm font-light focus:border-white outline-none transition-all appearance-none"
                >
                  <option value="" className="bg-black text-white">Select Status</option>
                  <option value="Male" className="bg-black text-white">Active (M)</option>
                  <option value="Female" className="bg-black text-white">Active (F)</option>
                  <option value="Other" className="bg-black text-white">Active (NB)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">Headquarters Address</label>
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
                onClick={() => navigate("/adminprofile")}
                className="flex-1 border border-gray-900 text-[10px] uppercase tracking-[0.2em] py-5 hover:border-white transition-all text-gray-500 hover:text-white"
              >
                Discard
              </button>

              <button
                onClick={handleSave}
                className="flex-1 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-medium py-5 hover:bg-gray-200 transition-all shadow-2xl"
              >
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProfile;
