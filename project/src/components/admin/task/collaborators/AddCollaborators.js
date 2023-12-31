import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";
import API_URL from "../../../../Url";

function AddCollaborators({ setAddCollaboratorsModal }) {
  const [username, setUsername] = useState("");
  const { user } = useContext(Context);
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const id = sessionStorage.getItem("taskId");
  const instituteId = sessionStorage.getItem("id");
  let menuRef = useRef();

  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setAddCollaboratorsModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAddCollaboratorsModal]);

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

  //submit member
  const submitMember = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.patch(
        `${API_URL.institute}/tasks/add-collabs/${id}`,
        {
          collaborators: [username],
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setAddCollaboratorsModal(false);
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

  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center pb-2">
          Add Collaborators
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder="Username"
              list="members"
              className="w-[90%] h-10 bg-gray_bg px-3 py-1"
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
                className="bg-green-600 h-[35px] w-full py-1 px-2"
                disabled={states.loading}
              >
                <p className="text-white">Submit</p>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default AddCollaborators;
