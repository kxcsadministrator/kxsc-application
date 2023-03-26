import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import "./resources.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function CreateResource({ setCreateResourceModal, instituteId }) {
  //sates
  const { user } = useContext(Context);
  const [allCat, setAllCat] = useState([]);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [subCat, setSubCat] = useState("");
  const [selectedCat, setSelectedCat] = useState([]);
  const [citation, setCitation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const navigate = useNavigate();
  let menuRef = useRef();

  //call categories
  useEffect(() => {
    const getCat = async () => {
      try {
        const res = await axios.get(`http://52.47.163.4:3002/categories/all`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setAllCat(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCat();

    //set modal to false when clicked
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

  //get sub categories
  const getSub = async (e) => {
    setCategory(e.target.value);
    try {
      const res = await axios.get(
        `http://52.47.163.4:3002/categories/subs?name=${e.target.value}`
      );
      setSelectedCat(res.data);
    } catch (err) {}
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.post(
        `http://52.47.163.4:3002/resources/new`,
        {
          topic: topic,
          description: description,
          author: user._id,
          category: category,
          sub_categories: [subCat],
          citations: [citation],
          resource_type: type,
          institute: instituteId,
          avatar: avatar,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false });
      navigate("/admin/resources");
    } catch (err) {
      setStates({
        loading: false,
        error: false,
        errMsg: err.response.data.message,
      });
    }
  };

  return (
    <div className="modal_container">
      <div className="ml-[24%] w-full">
        <div
          className="modal_content md:w-[80%] ml-[-20px] md:ml-0 mt-10 md:mt-0 "
          ref={menuRef}
        >
          <div className="resource_heading">
            <h1 className="text_h1_heading">Create Resource</h1>
          </div>
          <form className="create_form">
            <div className="input_content">
              <label>Topic :</label>
              <input
                type="text"
                placeholder="Topic"
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
                placeholder="citation"
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
            <div className="input_content_files">
              <label for="img">Select Avatar:</label>
              <input
                placeholder="Upload Avatar"
                type="file"
                id="img"
                name="img"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files)}
              />
            </div>
            <div className="input_content">
              <label className="block">Description:</label>
              <CKEditor
                editor={ClassicEditor}
                onReady={(editor) => {}}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            </div>

            <div>
              {states.loading ? (
                <div>
                  <p>Loading...</p>
                </div>
              ) : states.err ? (
                <div>
                  <p>{states.errMsg}</p>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="input_content justify-center">
              <button
                onClick={(e) => handleSubmit(e)}
                className="btn_green"
                disabled={states.loading}
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
