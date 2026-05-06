import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import BackArrow from "../../assets/Svg/BackArrow.svg"

function SignupPhone() {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Login page nundi vachina phone
  const phoneFromLogin = location.state?.phone || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

 
 const handleContinue = async () => {
  if (!name || !email || !role) {
    return alert("Please fill all fields");
  }
 
  try {
    const res = await fetch("http://localhost:5050/api/auth/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phoneFromLogin,
        role
      }),
    });
 
    const data = await res.json();
 
    if (!res.ok) {
      alert(data.msg);
      return;
    }
 
    localStorage.setItem("authData", JSON.stringify({ phone: phoneFromLogin }));
 
    navigate("/otp");
 
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <AuthLayout>
      <div className="header-container">
                     {/* 🔙 Back Button */}
                    <button
                      className="back-button"
                      onClick={() => navigate(-1)}
                    >
                      <img src={BackArrow} alt="BackArrow" />
                    </button>
                    <h2>Create an account</h2>
        </div>

      <p className="auth-subtitle">
        Create your account and start designing stunning visuals with ease
      </p>

      {/* 👇 Blue pill phone display */}
      <div className="signup-primary-display">
        {phoneFromLogin}
      </div>

      <input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="auth-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select your role</option>
        <option>Designer</option>
        <option>Business</option>
        <option>Student</option>
      </select>

      <button className="auth-button-login" onClick={handleContinue}>
        Continue with Phone Number
      </button>

    </AuthLayout>
  );
}

export default SignupPhone;