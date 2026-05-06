import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import BackArrow from "../../assets/Svg/BackArrow.svg";

function LoginPhone() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneLogin = async () => {

    // Frontend validation
    if (phone.length !== 10) {
      setPhoneError("Please enter a valid mobile number.");
      return;
    }

    setPhoneError("");

    try {
      const res = await fetch("http://localhost:5050/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.isNewUser) {
        navigate("/signup-phone", { state: { phone } });
        return;
      }

      localStorage.setItem("authData", JSON.stringify({ phone }));
      navigate("/otp");

    } catch (err) {
      console.error(err);
      setPhoneError("Server error. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div className="header-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <img src={BackArrow} alt="BackArrow" />
        </button>

        <h2>Get started with your phone number</h2>
      </div>

      <p className="auth-subtitle">
        Enter your mobile number to continue to Stackly
      </p>

      <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          className={phoneError ? "input-with-error" : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
            setPhoneError("");
          }}
        />

      {/* Error message */}
      {phoneError && (
        <p className="input-error">{phoneError}</p>
      )}

      <button
        className="auth-button-login"
        onClick={handlePhoneLogin}
      >
        Continue
      </button>

      <p className="auth-terms-LoginPhone">
        Having Trouble logging in?{" "}
        <a href="#">
          Contact Support
          <ArrowUpRightIcon className="footer-arrow-icon" />
        </a>
      </p>
    </AuthLayout>
  );
}

export default LoginPhone;