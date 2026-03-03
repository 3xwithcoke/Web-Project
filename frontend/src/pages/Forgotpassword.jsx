import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { resetPasswordApi, sendForgotPasswordOtpApi, verifyForgotPasswordOtpApi } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // OTP Timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Send OTP
  const handleSendOtp = async () => {
    setError("");
    try {
      await sendForgotPasswordOtpApi({ email: email.trim().toLowerCase() });
      toast.success("OTP sent successfully!");
      setStep(2);
      setTimer(120);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      await verifyForgotPasswordOtpApi({ email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP";
      setError(msg);
      toast.error(msg);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    setError("");
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await resetPasswordApi({ email, password, confirmPassword });
      toast.success("Password reset successful!");
      setStep(4);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4">
      <Toaster/>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-pink-100 p-8 md:p-10">
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          No worries, we'll help you reset your password
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Step 1 - Email */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2 - OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-center text-2xl letter-spacing tracking-wider"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
              <p className={`text-sm mt-2 font-semibold ${timer > 30 ? "text-gray-600" : timer > 10 ? "text-orange-600" : "text-red-600"}`}>
                OTP expires in <span className="inline-block w-8 text-center">{timer}s</span>
              </p>
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Step 3 - Reset Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Step 4 - Success */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-green-600 font-bold text-xl mb-2">
              Password Reset Successful!
            </p>
            <p className="text-gray-600">You can now log in with your new password.</p>
          </div>
        )}
      </div>
    </div>
  );
}
