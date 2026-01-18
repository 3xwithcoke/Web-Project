import { useState } from "react";
import toast from "react-hot-toast";
import { createUserApi } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    // Username check
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }

    // Email check
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }

    // Password check
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Confirm password check
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const dataToSubmit = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
      const response = await createUserApi(dataToSubmit); 
      if (response.data.success) {
        toast.success(response?.data?.message || 'Registration successful');
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      }
      else {
        toast.error('something went wrong');
      }

    } catch (error) {
      toast.error("Server error. Try again later.");
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },
  form: {
    width: "350px",
    padding: "30px",
    borderRadius: "12px",
    background: "#020617",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  title: {
    color: "#e5e7eb",
    textAlign: "center",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#38bdf8",
    color: "#020617",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Register;