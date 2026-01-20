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
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
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
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowBox}></div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.header}>
          <h2 style={styles.title}>IDENTITY <span style={{color: '#fff'}}>CORE</span></h2>
          <div style={styles.divider}></div>
        </div>

        <div style={styles.inputWrapper}>
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputWrapper}>
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputWrapper}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          style={styles.button}
          onMouseOver={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#000";
            e.target.style.boxShadow = "0 0 20px rgba(255,255,255,0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#fff";
            e.target.style.boxShadow = "none";
          }}
        >
          INITIALIZE REGISTRATION
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
    background: "#000", // Rich Black
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Courier New', Courier, monospace", // Monospace for tech feel
  },
  glowBox: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)",
    zIndex: 0,
  },
  form: {
    width: "380px",
    padding: "40px",
    background: "rgba(10, 10, 10, 0.8)",
    border: "1px solid #222",
    backdropFilter: "blur(10px)",
    zIndex: 1,
    position: "relative",
  },
  header: {
    marginBottom: "40px",
    textAlign: "left",
  },
  title: {
    color: "#444",
    fontSize: "18px",
    fontWeight: "900",
    letterSpacing: "5px",
    margin: 0,
  },
  divider: {
    width: "40px",
    height: "2px",
    background: "#fff",
    marginTop: "10px",
  },
  inputWrapper: {
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px 0px",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #333",
    color: "#fff",
    outline: "none",
    fontSize: "12px",
    letterSpacing: "2px",
    transition: "all 0.4s ease",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    background: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    fontWeight: "bold",
    fontSize: "11px",
    letterSpacing: "3px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
  },
};

export default Register;