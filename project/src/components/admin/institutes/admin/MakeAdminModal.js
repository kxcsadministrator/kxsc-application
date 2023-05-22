import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import API_URL from "../../../../Url";

function MakeAdminModal({ setAdminModal, instituteId }) {
  //states declaration
  const [username, setUsername] = useState("");
  const { user } = useContext(Context);
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });

  let menuRef = useRef();

  //useEffect functions
  useEffect(() => {
    //function to set modal false when outside modal is clicked
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setAdminModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAdminModal]);

  //function to request admin

  //ueseffect function to get members
  useEffect(() => {
    const getMembers = async () => {
      try {
        const res = await axios.get(
          `${API_URL.institute}/institutes/${instituteId}/search-member?name=${username}`,
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setMembers(res.data);
      } catch (err) {}
    };
    getMembers();
  }, [instituteId, user.jwt_token, username]);

  const submitAdmin = async (e) => {
    e.preventDefault();

    setStates({ loading: true, error: false });
    try {
      const res = await axios.patch(
        `${API_URL.institute}/institutes/add-admins/${instituteId}`,
        { admins: [username] },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });

      //timeout function thats closes modal on sucess
      setTimeout(() => {
        setAdminModal(false);
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
  };
  console.log(members);
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Make Admin
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <input
              placeholder="Username"
              list="members"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1 rounded-sm"
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
          <div>
            {states.loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : states.error ? (
              <div>
                <p className="err_text">{states.errMsg}</p>
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
                onClick={(e) => submitAdmin(e)}
                className="bg-green_bg  w-full text-white p-2 rounded-sm"
                disabled={states.loading}
              >
                Make Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakeAdminModal;
