import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { countries } from "countries-list";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../../Url";

function AddMemberModal({ setMemberModal, instituteId }) {
  //states
  const [username, setUsername] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newSelectedCountry, setNewSelectedCountry] = useState("");

  const { user } = useContext(Context);
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: [],
    success: false,
  });

  const navigate = useNavigate();
  let menuRef = useRef();

  //tab active states
  const [activeIndex, setActiveIndex] = useState(1);
  const handleClick = (index) => setActiveIndex(index);
  const checkActive = (index, className) =>
    activeIndex === index ? className : "";

  const handleCountrySelect = (event) => {
    const country = event.target.value;
    setNewSelectedCountry(country);
  };

  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setMemberModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setMemberModal]);

  //ueseffect function to get members
  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await axios.get(
          `${API_URL.user}/users/search-user?name=${username}`,
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setMembers(res.data);
      } catch (err) {}
    };
    getMembers();
  }, [instituteId, user.jwt_token, username]);

  console.log(user.jwt_token);

  //submit member
  const submitMember = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    if (newUser) {
      try {
        const res = await axios({
          method: "post",
          url: `${API_URL.user}/users/new-user-request/${instituteId}`,
          data: {
            first_name: newFirstName,
            last_name: newLastName,
            phone: newPhoneNumber,
            country: newSelectedCountry,
            username: newUsername,
            email: newEmail,
          },
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });

        setStates({ loading: false, error: false, success: true });
        setTimeout(() => {
          setMemberModal(false);
          window.location.reload(false);
        }, 3000);
      } catch (err) {
        console.log(err);
        setStates({
          loading: false,
          error: true,
          errMsg:
            err.response.data?.message || err.response.data?.errors[0].msg,
          success: false,
        });
      }
    } else {
      try {
        const res = await axios.patch(
          `${API_URL.institute}/institutes/add-members/${instituteId}`,
          {
            members: [username],
          },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setStates({ loading: false, error: false, success: true });
        setTimeout(() => {
          setMemberModal(false);
          window.location.reload(false);
        }, 3000);
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.message,
          success: false,
        });
      }
    }
  };
  console.log(newUser);
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="text_h1_heading">Add Member</h1>
        <div className="flex flex-col -mt-5 items-center w-full gap-3">
          <form>
            <div className="tabsMsg">
              <div
                className={`tabMsg ${checkActive(1, "active")}`}
                onClick={() => {
                  handleClick(1);
                  setNewUser(false);
                }}
              >
                Registered user
              </div>

              <div
                className={`tab_2 tabMsg ${checkActive(2, "active")}`}
                onClick={() => {
                  handleClick(2);
                  setNewUser(true);
                }}
              >
                New user
              </div>
            </div>
            <div className="flex flex-col w-[90%] mx-auto gap-6 -mt-5">
              <div className={`panelMsg ${checkActive(1, "active")}`}>
                <input
                  placeholder="Username"
                  list="members"
                  className="w-[100%] rounded-sm h-10 bg-gray_bg px-3 py-1"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <datalist id="members">
                  {members.map((member, index) => (
                    <option key={index}>{member.username}</option>
                  ))}
                </datalist>
              </div>
              <div className={`panelMsg ${checkActive(2, "active")}`}>
                <input
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  placeholder="First Name"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                />
                <input
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  placeholder="Last Name"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                />
                <input
                  placeholder="Phone Number"
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  type="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                />
                <select
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  value={newSelectedCountry}
                  onChange={handleCountrySelect}
                >
                  <option value="">Select a country</option>
                  {Object.keys(countries).map((countryCode) => (
                    <option key={countryCode} value={countryCode}>
                      {countries[countryCode].name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Username"
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                  }}
                />
                <input
                  placeholder="Email"
                  className="w-[100%] h-10 bg-gray_bg px-3 py-1"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                />
              </div>
            </div>
          </form>
          <div>
            {states.loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : states.error ? (
              <div>
                <p className="text-red-400">{states.errMsg}</p>
              </div>
            ) : states.success ? (
              <div>
                <p className="text-green-400">Success</p>
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <button
                onClick={(e) => submitMember(e)}
                className="btn_green py-1"
                disabled={states.loading}
              >
                Submit
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;
