import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfileApi } from "../services/api";
import HeaderCard from "../component/dashboard/HeaderCard"

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
    profilePicture:"",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfileApi();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("userUpdated"))
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    if (location.state?.refresh || !user.username) {
      fetchProfile();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, user.username]);


  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16">

        <div className='md:w-80 flex-shrink-0'>
          <HeaderCard/>
        </div>

        <div className='flex-1 space-y-12'>
          <div className="bg-gray-950 border border-gray-900 p-10 flex items-center gap-10">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-900 border border-gray-800">
              <img
                src={user.profilePicture? `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}?t=${Date.now()}`:"/src/assets/user.png"}
                alt="Profile"
                className="w-full h-full object-cover grayscale"
              />
            </div>  
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-light tracking-tight italic">
                {user.username || "Legacy Member"}
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                {user.email || "Email Address"}
              </p>
            </div>
          </div>

          <div className="bg-black border border-gray-900 p-10 space-y-12">
            <div className="flex justify-between items-end border-b border-gray-900 pb-4">
              <h2 className="text-xs uppercase tracking-[0.4em] text-gray-500 font-medium">
                Identity Profile
              </h2>
              <button
                onClick={() => navigate("/editprofile")}
                className="text-[10px] uppercase tracking-widest text-white hover:text-gray-400 transition underline underline-offset-8"
              >
                Modify
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { label: "Username", value: user.username },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phoneNumber },
                { label: "Origin Date", value: user.dob, type: "date" },
                { label: "Gender", value: user.gender },
              ].map(({ label, value, type = "text" }) => (
                <div key={label} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-600">
                    {label}
                  </label>
                  <p className="text-sm font-light text-gray-300 tracking-wide border-b border-gray-900/50 pb-2">
                    {value || "—"}
                  </p>
                </div>
              ))}

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-600">
                  Residence
                </label>
                <p className="text-sm font-light text-gray-300 tracking-wide border-b border-gray-900/50 pb-2">
                  {user.address || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
