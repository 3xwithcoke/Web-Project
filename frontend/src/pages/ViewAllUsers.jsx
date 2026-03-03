import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserSearch from '../component/admin/UserSearch';
import AdminCard from "../component/dashboard/AdminCard";


const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/viewallusers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Admin Card */}
        <div className="lg:w-1/4">
          <AdminCard />
        </div>

        {/* Users Section */}
        <div className="lg:w-3/4 flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Directory</h1>
            <p className="text-gray-500">Manage and view all registered accounts.</p>
          </div>

          <UserSearch query={searchTerm} setQuery={setSearchTerm} />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {error && (
              <div className="p-4 bg-red-100 text-red-700">
                {error}
              </div>
            )}

            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone Number</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length ? (
                  filteredUsers.map(user => (
                    <tr
                      key={user.user_id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-5 text-sm font-medium">
                        {user.username || "N/A"}
                      </td>
                      <td className="px-5 py-5 text-sm">{user.email}</td>
                      <td className="px-5 py-5 text-sm">
                        {user.phoneNumber || "---"}
                      </td>
                      <td className="px-5 py-5 text-sm">
                        {user.address || "No address"}
                      </td>
                      <td className="px-5 py-5 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-gray-400 italic"
                    >
                      No users found.
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
