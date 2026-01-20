import { useState } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { loginUserApi } from '../services/api';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Fixed: Added preventDefault

        if (!email || !password) {
            return toast.error("Please enter all fields");
        }

        const formdata = { email, password };
        
        try {
            const response = await loginUserApi(formdata);
            
            if (!response?.data?.success) {
                return toast.error(response?.data?.message || "Login failed");
            }

            localStorage.setItem("token-37c", response?.data?.token);
            toast.success(response?.data?.message);

            let decoded;
            try {
                decoded = jwtDecode(response?.data?.token);
            } catch (err) {
                return toast.error("Invalid token format");
            }

            // Navigate based on role
            if (decoded.role === "admin") {
                navigate("/admindash");
            } else {
                navigate("/userdash");
            }

        } catch (err) {
            return toast.error(err?.response?.data?.message || "Server connection error");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glowBox}></div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.header}>
                    <h2 style={styles.title}>ACCESS <span style={{color: '#fff'}}>GRANTED</span></h2>
                    <div style={styles.divider}></div>
                </div>

                <div style={styles.inputWrapper}>
                    <input
                        type="email"
                        placeholder="IDENTIFICATION / EMAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputWrapper}>
                    <input
                        type="password"
                        placeholder="SECURITY KEY / PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    AUTHENTICATE
                </button>
                
                <p style={styles.footerText} onClick={() => navigate("/register")}>
                    NEW OPERATOR? <span style={{color: '#fff', cursor: 'pointer'}}>REGISTER</span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Courier New', Courier, monospace",
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
    footerText: {
        marginTop: "25px",
        color: "#444",
        fontSize: "10px",
        textAlign: "center",
        letterSpacing: "2px",
    }
};

export default Login;