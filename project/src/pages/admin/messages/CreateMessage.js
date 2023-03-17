import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateMessage() {
  const { user } = useContext(Context);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try {
      const res = await axios.post(
        "http://13.36.208.80:3000/messages/new/",
        {
          body: message,
          recipient: recipient,
          subject: subject,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      console.log(res.data);
      navigate("/admin/messages");
    } catch (err) {
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.errors);
      console.log(err);
    }
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          <form className="flex flex-col items-center gap-6 bg-white shadow-md w-[80%] mx-auto h-fit pb-5 rounded-md">
            <h1 className="text-[20px] text-center my-2 pb-2 border-b-2 border-b-[#e5e7eb] w-full">
              Send Message
            </h1>

            <div className="flex flex-col w-[90%] mx-auto gap-6">
              <div className="w-full">
                <input
                  placeholder="Recipient"
                  className="w-[70%] h-full bg-transparent border-2 border-[#707070] rounded-md px-2 py-1"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="w-full">
                <input
                  placeholder="Subject"
                  className="w-[70%] h-full bg-transparent border-2 border-[#707070] rounded-md px-2 py-1"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="w-full">
                <textarea
                  placeholder="Message"
                  className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div>
                {loading ? (
                  <div>
                    <p>Loading...</p>
                  </div>
                ) : err ? (
                  <div>
                    {errMsg.map((msg) => (
                      <div key={msg.param}>
                        <p>{msg.msg}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="bg-green_bg h-[40px] w-[35%] py-1 px-3"
                  disabled={loading}
                >
                  <p className="text-white">Submit</p>
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
