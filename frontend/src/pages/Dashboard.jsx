import { useState, useEffect } from 'react';
import { getUser, deleteUserById } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getallusers = async () => {
      try {
        const response = await getUser();
        if (response?.data?.success) {
          setData(response?.data?.user);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getallusers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await deleteUserById(id);
      if (response?.data?.success) {
        setData(prevData => prevData.filter(user => user.id !== id));
        return toast.success(response?.data?.message);
      } else {
        return toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleEdit=(id) => {
    navigator('/edit-user/${id}')
    }

  if (loading) return <p className="text-gray-500">Loading data...</p>;

  return (
    
    <div>
      <table className="min-w-full border-collapse border border-gray-200 mt-10 shadow-sm">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-3 px-4 border border-indigo-500 text-left">Id</th>
            <th className="py-3 px-4 border border-indigo-500 text-left">Email</th>
            <th className="py-3 px-4 border border-indigo-500 text-left">Username</th>
            <th className="py-3 px-4 border border-indigo-500 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr
              key={user.id}
              className="even:bg-gray-50 hover:bg-indigo-50 transition-colors"
            >
              <td className="py-2 px-4 border border-gray-200 text-gray-700">
                {index + 1}
              </td>
              <td className="py-2 px-4 border border-gray-200 text-gray-700">
                {user.email}
              </td>
              <td className="py-2 px-4 border border-gray-200 text-gray-700">
                {user.username}
              </td>
              <td className="py-2 px-4 border border-gray-200">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded mr-2 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white py-1 px-3 rounded transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
