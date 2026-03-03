import toast from "react-hot-toast";
import { deleteMyAccountApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HeaderProfile from "../component/dashboard/HeaderProfile";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
    toast.custom((t) => (
      <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex gap-3">
        <span>⚠️ This will permanently delete your account</span>
      </div>
    ), { duration: Infinity });
  };

  const deleteAccount = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteMyAccountApi();
      
      if (res.data.success || res.status === 200) {
        toast.success("Account deleted permanently", {
          position: "bottom-right",
          style: { background: "#10b981", color: "#fff" },
        });
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect after showing toast
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.error("Delete account error:", err);
      if (err.response?.status === 401) {
        toast.error("Please login again to delete your account");
      } else {
        toast.error(err.response?.data?.message || "Error deleting account");
      }
    } finally {
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    toast.dismiss();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-600">Delete Account</h1>
              <p className="text-gray-600">This action is permanent and cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded">
            <p className="text-red-800 font-medium">
              ⚠️ When you delete your account:
            </p>
            <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
              <li>Your profile information will be permanently deleted</li>
              <li>Your order history will be removed</li>
              <li>Your wishlist and cart will be cleared</li>
              <li>This cannot be reversed</li>
            </ul>
          </div>

          <button
            onClick={handleDeleteClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition transform active:scale-95"
          >
            Yes, Delete My Account Permanently
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition"
          >
            Cancel
          </button>

          {showConfirmation && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-600 rounded-lg">
              <p className="text-red-800 font-bold mb-4">
                ⚠️ Are you absolutely sure? This cannot be undone!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={deleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Now"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;