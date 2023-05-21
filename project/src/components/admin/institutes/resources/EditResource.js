import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../context/Context";
import "./resources.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API_URL from "../../../../Url";

function EditResource({ setEditResourceModal, resource }) {
  //sates
  const { user } = useContext(Context);
  const [allCat, setAllCat] = useState([]);
  const [topic, setTopic] = useState(resource.topic);
  const [category, setCategory] = useState();
  const [subCat, setSubCat] = useState(resource.sub_categories);
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
  let menuRef = useRef(null);

  //call categories
  useEffect(() => {
    setTopic(resource.topic);
    setAvatar(resource.avatar);
    setCitation(resource.citations[0]);
    const getCat = async () => {
      try {
        const res = await axios.get(`${API_URL.resource}/categories/all`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setAllCat(res.data);
        setCategory(resource.category);
        setSelectedCat(
          res.data.find((cat) => cat.name === resource.category)
            ?.sub_categories || []
        );
        setType(resource.resource_type);
      } catch (err) {
        console.log(err);
      }
    };
    getCat();

    //set modal to false when clicked
    function handler(e) {
      if (!menuRef.current.contains(e.target)) {
        setEditResourceModal(false);
      }
    }
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [user.jwt_token, setEditResourceModal]);

  //get sub categories
  const getSub = async (e) => {
    setCategory(e.target.value);
    setSubCat([]);
    try {
      const res = await axios.get(
        `${API_URL.resource}/categories/subs?name=${e.target.value}`
      );
      setSelectedCat(res.data);
    } catch (err) {}
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    try {
      const res = await axios.patch(
        `${API_URL.resource}/resources/update/${resource.id}`,
        {
          topic: topic,
          description: description,
          author: user._id,
          category: category,
          sub_categories: subCat,
          citations: [citation],
          resource_type: type,
          institute: resource.institute._id,
          avatar: avatar,
        },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false });
      navigate("/admin/resources");
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
      });
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSubCat((prevSelectedItems) => [...prevSelectedItems, value]);
    } else {
      setSubCat((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== value)
      );
    }
  };

  return (
    <div className="modal_container">
      <div
        className="relative md:w-[60%] w-[90%] rounded-md mx-auto bg-white"
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
              value={category}
              className="select"
            >
              {allCat.map((cat, index) => {
                return (
                  <option key={index} value={cat.name}>
                    {cat.name || resource.category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input_content">
            <label>Sub_categories:</label>
            <div className="flex gap-3  flex-wrap">
              {selectedCat.map((sub, index) => (
                <div className="flex  gap-1" key={index}>
                  <input
                    type="checkbox"
                    value={sub}
                    onChange={handleCheckboxChange}
                    checked={subCat.includes(sub)}
                  />
                  <p className="text-sm mt-[10px]">{sub}</p>
                </div>
              ))}
            </div>
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
            <select onChange={(e) => setType(e.target.value)} value={type}>
              <option value="government">government</option>
              <option value="private">private</option>
              <option value="education">education</option>
            </select>
          </div>
          <div className="input_content_files">
            <label for="img">Select Avatar:</label>
            <input
              className="custom-file-input"
              placeholder="Upload Avatar"
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files)}
            />
          </div>
          <div className="w-[90%] pl-3 relative">
            <label className="">Description:</label>
            <CKEditor
              editor={ClassicEditor}
              onReady={(editor) => {
                editor.setData(resource.description);
              }}
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
            ) : states.error ? (
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
  );
}

export default EditResource;
