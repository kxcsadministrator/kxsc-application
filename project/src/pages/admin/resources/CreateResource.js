import Sidebar from "../../../component/admin/Sidebar";
import Topbar from "../../../component/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../context/Context";
import "./resources.css";

function CreateResource() {
  const { user } = useContext(Context);
  const [institutes, setInstitutes] = useState([]);
  const [institute, setInstitute] = useState({});
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [subCat, setSubCat] = useState("");
  const [citation, setCitation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const res = await axios.get("http://13.36.208.80:3001/institutes/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setInstitutes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getInstitutes();
  }, [user.jwt_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(false);
    try {
      const res = await axios.post(
        "http://13.36.208.80:3002/resources/new",
        {
          topic: topic,
          description: description,
          author: user._id,
          category: category,
          sub_categories: [subCat],
          citations: [citation],
          resource_type: type,
          institute: institute,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      console.log(res.data);
      navigate("/admin/resources");
    } catch (err) {
      setLoading(false);
      setErr(true);

      console.log(err);
    }
  };
  console.log(type);
  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="md:w-[24%]">
        <Sidebar />
      </div>
      <div className="md:w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="resource_container">
          <div className="resource_heading">
            <h1 className="text-center text-3xl">Create Resource</h1>
          </div>
          <form>
            <div className="input_content">
              <label>Topic :</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="input_content">
              <label>Category :</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="input_content">
              <label>Sub_categories:</label>
              <input
                type="text"
                value={subCat}
                onChange={(e) => setSubCat(e.target.value)}
              />
            </div>
            <div className="input_content">
              <label>Citations:</label>
              <input
                type="text"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
              />
            </div>
            <div className="input_content">
              <label>Resource Type:</label>
              <input list="data" onChange={(e) => setType(e.target.value)} />
              <datalist id="data">
                <option value="government" />
                <option value="private" />
                <option value="education" />
              </datalist>
            </div>
            <div className="input_content">
              <label>Description:</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="input_content justify-center py-2">
              <label>Select institute:</label>
              <div>
                <select
                  onChange={(e) => setInstitute(e.target.value)}
                  className="select"
                >
                  {institutes.map((institute, index) => {
                    return (
                      <option key={index} value={institute}>
                        {institute.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div>
              {loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : err ? (
                <div>
                  <p>{errMsg}</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="input_content justify-center">
              <button
                onClick={(e) => handleSubmit(e)}
                className="bg-green-600 h-[40px] w-[30%] py-1 px-3 text-white"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateResource;
