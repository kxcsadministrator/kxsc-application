import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Url";
import { countries } from "countries-list";

function CreateUser() {
  const { user } = useContext(Context);
  const [superAdmin, setSuperAdmin] = useState(false);
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
  });
  const navigate = useNavigate();

  const handleCountrySelect = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (superAdmin) {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.post(
          `${API_URL.user}/users/new/super-admin`,
          {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            country: selectedCountry,
            username: username,
            email: email,
            password: password,
          },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setStates({ loading: false, error: false });
        navigate("/admin/users");
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    } else {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.post(
          `${API_URL.user}/users/new`,
          {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            country: selectedCountry,
            username: username,
            email: email,
            password: password,
          },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setStates({ loading: false, error: false });
        navigate("/admin/users");
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    }
  };
  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>

        <form className="user_form">
          <h1 className="form_header">Create User</h1>
          <div className="user_input_container">
            <div className="user_input_row">
              <label>First Name: </label>
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Last Name: </label>
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Phone number: </label>
              <input
                placeholder="Phone Number"
                value={phoneNumber}
                type="number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Select Country</label>
              <select value={selectedCountry} onChange={handleCountrySelect}>
                <option value="">Select a country</option>
                {Object.keys(countries).map((countryCode) => (
                  <option key={countryCode} value={countryCode}>
                    {countries[countryCode].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="user_input_row">
              <label>Username: </label>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Email: </label>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="user_input_row">
              <label>Password: </label>
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.error ? (
                <div>
                  <p className="text-sm text-red-600">{states.errMsg}</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="form_button_btn">
              <button
                onClick={(e) => handleSubmit(e)}
                className="user_submit_button"
                disabled={states.loading}
              >
                Submit
              </button>
              {user.superadmin && (
                <div className="flex items-start gap-3">
                  <div>
                    <input
                      type="checkbox"
                      name="superAdmin"
                      onChange={(e) => setSuperAdmin(e.target.checked)}
                    />
                  </div>
                  <p>Make Super Admin</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
