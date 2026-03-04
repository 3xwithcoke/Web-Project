import React, { useState, useEffect } from 'react';
import { getAllUsersApi } from '../services/api';
import UserSearch from '../component/admin/UserSearch';
import AdminCard from "../component/dashboard/AdminCard";
import toast, { Toaster } from "react-hot-toast";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersApi("user");
        if (response.data.success) {
          setUsers(response.data.data || []);
        }
      } catch (err) {
        toast.error("Failed to retrieve member registry");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Inquiring Registry...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6 selection:bg-white selection:text-black">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">

        <div className="lg:w-80 flex-shrink-0">
          <AdminCard />
        </div>

        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-light tracking-tight italic">Member Registry</h1>
            <div className="w-24 h-[1px] bg-gray-900"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">Active Collectors Database</p>
          </div>

          <div className="bg-gray-950/20 border border-gray-900 p-8">
             <UserSearch query={searchTerm} setQuery={setSearchTerm} />
          </div>

          <div className="overflow-x-auto border border-gray-900">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-900">
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Identity</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Contact</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium">Residence</th>
                  <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-600 font-medium text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-900/50">
                {filteredUsers.length ? (
                  filteredUsers.map(user => (
                    <tr key={user.user_id} className="group hover:bg-gray-950/50 transition-colors">
                      <td className="px-8 py-8">
                        <p className="text-sm font-light text-white uppercase tracking-wide">{user.username || "Anonymous"}</p>
                        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest italic">Member ID: #{user.user_id}</p>
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-sm font-light text-gray-400">{user.email}</p>
                        <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">{user.phoneNumber || "No contact"}</p>
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-sm font-light text-gray-500 line-clamp-1 italic">{user.address || "Undisclosed"}</p>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <span className={`text-[9px] uppercase tracking-[0.2em] px-3 py-1 border ${
                          user.is_active ? "border-green-900 text-green-700" : "border-red-900 text-red-700"
                        }`}>
                          {user.is_active ? "Authenticated" : "Suspended"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-700 text-[10px] uppercase tracking-[0.4em] italic">
                      No matching records in archives
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewAllUsers;
