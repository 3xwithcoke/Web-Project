import { useState } from "react";
import HeaderCard from "../component/dashboard/HeaderCard";
import { changePasswordApi } from "../services/api";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match" });
    }

    if (formData.newPassword.length < 6) {
      return setStatus({
        type: "error",
        message: "Password must be at least 6 characters",
      });
    }

    setLoading(true);

    try {
      const { data } = await changePasswordApi({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setStatus({ type: "success", message: data.message });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error.response?.data);
      setStatus({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white px-6 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar - HeaderCard */}
        <div className="lg:col-span-1">
          <HeaderCard />
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                🔐 Update Password
              </h2>
              <p className="text-gray-600">Secure your account with a new password</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {status.message && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium ${
                    status.type === "error"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-green-100 text-green-700 border border-green-300"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <label className="flex items-center gap-3 text-gray-700 font-medium cursor-pointer hover:text-pink-600 transition-colors">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-5 h-5 accent-pink-600 cursor-pointer"
                />
                Show passwords
              </label>

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? "Updating..." : "Save New Password"}
              </button>

              <p className="text-sm text-gray-600 text-center mt-6">
                Make sure your password is at least 6 characters long and contains a mix of letters and numbers for better security.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;