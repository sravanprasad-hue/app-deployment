import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./Auth.css";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import BackArrow from "../../assets/Svg/BackArrow.svg";

function LoginEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleContinue = async () => {

    // Empty check
    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    // Format validation
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");

    try {
      // Check user
      const checkRes = await fetch(
        "http://localhost:5050/api/auth/check-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        setEmailError(checkData.msg);
        return;
      }

      // New user → Signup
      if (checkData.isNewUser) {
        navigate("/signup-email", { state: { email } });
        return;
      }

      // Existing user → Send OTP
      const otpRes = await fetch(
        "http://localhost:5050/api/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setEmailError(otpData.msg);
        return;
      }

      localStorage.setItem("authData", JSON.stringify({ email }));
      navigate("/otp");

    } catch (err) {
      console.error(err);
      setEmailError("Server error. Please try again.");
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

        <h2>Get started with your email</h2>
      </div>

      <p className="auth-subtitle">
        Use your email or Google account to continue to Stackly
      </p>

      <input
          type="email"
          placeholder="Enter your email"
          value={email}
          className={emailError ? "input-with-error" : ""}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />

      {/* Error message */}
      {emailError && (
        <p className="input-error">{emailError}</p>
      )}

      <button
        className="auth-button-login"
        onClick={handleContinue}
      >
        Continue
      </button>

      <p className="auth-terms-LoginEmail">
        Having Trouble logging in?{" "}
        <a href="#">
          Contact Support
          <ArrowUpRightIcon className="footer-arrow-icon" />
        </a>
      </p>
    </AuthLayout>
  );
}

export default LoginEmail;