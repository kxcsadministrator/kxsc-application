import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API_URL from "../../../Url";

function CreateBlog() {
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [avatar, setAvatar] = useState("");
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStates({ loading: true, error: false });
    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("title", title);
    formData.append("body", body);
    try {
      const res = await axios.post(`${API_URL.user}/blog/new`, formData, {
        headers: { Authorization: `Bearer ${user.jwt_token}` },
      });
      setStates({ loading: false, error: false, success: true });
      navigate("/admin/blog");
    } catch (err) {
      console.log(err);
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
        <form className="institute_form px-3">
          <h1 className="form_header">Create Blog</h1>
          <input
            placeholder="title"
            className="w-full h-10 mx-auto border-2 border-gray-200 px-3 py-1"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            className="w-full h-10 mx-auto  px-3 py-1"
            placeholder="Upload Image"
            type="file"
            id="img"
            name="img"
            accept="image/*"
            filename={avatar}
            onChange={(e) => setAvatar(e.target.files[0])}
          />
          <CKEditor
            editor={ClassicEditor}
            onReady={(editor) => {}}
            onChange={(event, editor) => {
              const data = editor.getData();
              setBody(data);
            }}
          />

          <div className="text-center">
            {states.loading ? (
              <div>
                <p>Loading...</p>
              </div>
            ) : states.err ? (
              <div>
                <p>{states.errMsg}</p>
              </div>
            ) : states.success ? (
              <div>
                <p className="text-base text-green-400">success</p>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="form_button_btn">
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

export default CreateBlog;
