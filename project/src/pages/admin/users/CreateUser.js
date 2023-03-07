import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import { Context } from "../../../context/Context";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const { user } = useContext(Context);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (superAdmin) {
      setLoading(true);
      setErr(false);
      try {
        const res = await axios.post(
          "http://13.36.208.80:3000/users/new/super-admin",
          {
            username: username,
            email: email,
            password: password,
          },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setLoading(false);
        console.log(res.data);
        navigate("/admin/users");
      } catch (err) {
        setLoading(false);
        setErr(true);
        setErrMsg(err.response.data.errors);
        console.log(err);
      }
    } else {
      setLoading(true);
      setErr(false);
      try {
        const res = await axios.post("http://13.36.208.80:3000/users/new", {
          username: username,
          email: email,
          password: password,
        });
        setLoading(false);
        console.log(res.data);
        navigate("/admin/users");
      } catch (err) {
        setLoading(false);
        setErr(true);
        setErrMsg(err.response.data.errors);
        console.log(err);
      }
    }
  };
  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="md:w-[24%]">
        <Sidebar />
      </div>
      <div className="md:w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          <form className="flex flex-col items-center gap-6 bg-white shadow-md w-[80%] mx-auto h-fit pb-5 rounded-md">
            <h1 className="text-[20px] text-center my-2 pb-2 border-b-2 border-b-[#e5e7eb] w-full">
              Create User
            </h1>
            <div className="flex flex-col justify-center gap-6">
              <div className="flex gap-3 items-center">
                <p className="w-[30%]">Username: </p>
                <div className="w-[300px] h-[40px]">
                  <input
                    placeholder="Username"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="w-[30%]">Email: </p>
                <div className="w-[300px] h-[40px]">
                  <input
                    placeholder="Email"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <p className="w-[30%]">Password: </p>
                <div className="w-[300px] h-[40px]">
                  <input
                    placeholder="Password"
                    className="w-full h-full bg-transparent border-2 border-[#707070] rounded-md px-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
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
              <div className="flex gap-3 items-center mt-6 justify-between">
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="bg-green_bg h-[40px] w-[35%] py-1 px-3"
                  disabled={loading}
                >
                  <p className="text-white">Submit</p>
                </button>
                {user.superadmin && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="superAdmin"
                      onChange={(e) => setSuperAdmin(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <p>Make Super Admin</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
