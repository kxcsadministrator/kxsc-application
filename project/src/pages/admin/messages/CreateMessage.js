import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateMessage() {
  //states
  const { user } = useContext(Context);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  //ueseffect function to get members
  useEffect(() => {
    const getMembers = async () => {
      if (user.superadmin) {
        try {
          const res = await axios.get(
            `http://52.47.163.4:3000/users/search-user?name=${recipient}`,
            { headers: { Authorization: `Bearer ${user.jwt_token}` } }
          );
          setMembers(res.data);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(
            `http://52.47.163.4:3001/institutes/${user.main_institute._id}/search-member?name=${recipient}`,
            { headers: { Authorization: `Bearer ${user.jwt_token}` } }
          );
          setMembers(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    getMembers();
  }, [recipient, user.jwt_token, user.main_institute?._id, user.superadmin]);

  //submit message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.post(
        `http://52.47.163.4:3000/messages/new/`,
        {
          body: message,
          recipient: recipient,
          subject: subject,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false });
      console.log(res.data);
      navigate("/admin/messages");
    } catch (err) {
      setStates({
        loading: false,
        error: false,
        errMsg: err.response.data.message,
      });
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
        <div className="py-2 px-5">
          <form className="form_message">
            <h1 className="message_heading">Send Message</h1>

            <div className="flex flex-col w-[90%] mx-auto gap-6">
              <div className="w-full">
                <input
                  placeholder="Recipient"
                  list="members"
                  className="message_input"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <datalist id="members">
                  {members.map((member, index) => (
                    <option key={index}>{member.username}</option>
                  ))}
                </datalist>
              </div>
              <div className="w-full">
                <input
                  placeholder="Subject"
                  className="message_input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="w-full">
                <textarea
                  placeholder="Message"
                  className="message_input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div>
                {states.loading ? (
                  <div>
                    <p>Loading...</p>
                  </div>
                ) : states.error ? (
                  <div>
                    <p>{states.errMsg}</p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="btn_green"
                  disabled={states.loading}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateMessage;
