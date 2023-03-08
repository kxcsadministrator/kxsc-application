import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import "./resources.css";

function CreateResource({ setCreateResourceModal, instituteId }) {
  const { user } = useContext(Context);
  const [allCat, setAllCat] = useState([]);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [subCat, setSubCat] = useState("");
  const [selectedCat, setSelectedCat] = useState([]);
  const [citation, setCitation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  let menuRef = useRef();

  useEffect(() => {
    const getCat = async () => {
      try {
        const res = await axios.get("http://13.36.208.80:3002/categories/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setAllCat(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCat();

    function handler(e) {
      if (!menuRef.current.contains(e.target)) {
        setCreateResourceModal(false);
      }
    }
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [user.jwt_token, setCreateResourceModal]);

  const getSub = async (e) => {
    setCategory(e.target.value);
    try {
      const res = await axios.get(
        `http://13.36.208.80:3002/categories/subs?name=${e.target.value}`
      );
      setSelectedCat(res.data);
    } catch (err) {}
  };

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
          institute: instituteId,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setLoading(false);
      navigate("/admin/resources");
    } catch (err) {
      setLoading(false);
      setErr(true);
      console.log(err);
    }
  };

  return (
    <div className="modal_container">
      <div className="ml-[24%] w-full">
        <div className="modal_content w-[80%]" ref={menuRef}>
          <div className="resource_heading">
            <h1 className="text-center text-3xl">Create Resource</h1>
          </div>
          <form className="create_form">
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
              <select
                onChange={(e) => {
                  getSub(e);
                }}
                className="select"
              >
                <option>-select category</option>
                {allCat.map((cat, index) => {
                  return (
                    <option key={index} value={cat.name}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="input_content">
              <label>Sub_categories:</label>
              <select
                onChange={(e) => setSubCat(e.target.value)}
                className="select"
              >
                <option>-select sub category</option>
                {selectedCat.map((sub, index) => {
                  return (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  );
                })}
              </select>
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
              <select onChange={(e) => setType(e.target.value)}>
                <option>-select resource type</option>
                <option value="government">government</option>
                <option value="private">private</option>
                <option value="education">education</option>
              </select>
            </div>
            <div className="input_content">
              <label>Description:</label>
              <textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
