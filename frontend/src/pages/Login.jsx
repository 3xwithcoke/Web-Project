import { useState } from 'react'
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { loginUserApi } from '../services/api';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submit = async (e) => {
        if (!email || !password) {
            return toast.error("please enter all fields")
        }
        const formdata = {
            email: email, password: password
        }
        try {

            const response = await loginUserApi(formdata);
            if (!response?.data?.success) {
                return toast.error(response?.data?.message);
            }
            localStorage.setItem("token-37c", response?.data?.token)
                // localStorage.setItem("user", JSON.stringify(response?.data?.user))
            toast.success(response?.data?.message)
            let decoded;
            try {
                decoded = jwtDecode(response?.data?.token);
            } catch {
                return toast.error("Invalid token");
            }

            if (decoded.role === "admin") {
                navigate("/admindash");
            } else {
                navigate("/userdash");
            }

        }
        catch (err) {
            return toast.error(err?.response?.data?.message)
        }
    }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
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

export default Login;