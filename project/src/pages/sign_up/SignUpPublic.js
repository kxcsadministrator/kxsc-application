import axios from "axios";
import React, { useRef, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sign_up.css";
import API_URL from "../../Url";
import { countries } from "countries-list";

function SignUpPublic() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const navigate = useNavigate();

  const handleCountrySelect = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.post(`${API_URL.user}/users/new-public-user`, {
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        country: selectedCountry,
        username: username,
        email: email,
        password: password,
      });
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        navigate("/public/login");
      }, 3000);
    } catch (err) {
      console.log(err.response.data.errors);
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
    }
  };

  return (
    <div className="signIn_container">
      <div className="form_container">
        <form className="signIn_form">
          <div className="w-[80%] mx-auto ">
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="w-[80%] mx-auto ">
            <p className="text-2xl font-bold text-green_bg text-center">
              Sign In
            </p>
          </div>
          <div className="input_container">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <select value={selectedCountry} onChange={handleCountrySelect}>
              <option value="">Select a country</option>
              {Object.keys(countries).map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countries[countryCode].name}
                </option>
              ))}
            </select>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.error ? (
                <div>
                  <p className="text-red-500">{states.errMsg}</p>
                </div>
              ) : states.success ? (
                <div>
                  <p className="text-green-400">Success</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              disabled={states.loading}
              className="text-white"
            >
              Sign Up
            </button>
          </div>
          <div className="flex separator items-center">
            <span></span>
            <div className="or">OR</div>
            <span></span>
          </div>
          <p className="text-center text-sm">
            <Link
              to="/admin/forgot-password"
              className="link text-center text-gray-400 hover:text-green_bg"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
      <div className="sign_container">
        <p>Already have an account? </p>
        <Link
          to="/public/login"
          className="link text-[#34c684] hover:text-black"
        >
          Login In
        </Link>
      </div>
      <footer className="mt-[30px] text-center">
        <p>© 2023 KXC INC. FROM KXC INC.</p>
      </footer>
    </div>
  );
}

export default SignUpPublic;
