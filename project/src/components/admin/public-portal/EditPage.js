import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API_URL from "../../../url";

function EditPage({ setEditPageModal, section, edit }) {
  const [title, setTitle] = useState(edit.title);
  const [body, setBody] = useState(edit.body);
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  let menuRef = useRef();

  //set modal false
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setEditPageModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditPageModal]);

  const editPage = async () => {
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.patch(
        `${API_URL.user}/pages/edit-page/${section}/${edit.title}`,
        {
          title: title !== edit.title ? title : null,
          body: body !== edit.body ? body : null,
        },
        {
          headers: {
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditPageModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.errors
          ? err.response.data.errors[0].msg
          : err.response.data.message,
        success: false,
      });
    }
  };
  return (
    <div className="modal_container">
      <div className="modal_content  md:w-[50%]" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Edit Page
        </h1>
        <div className="flex flex-col w-full gap-3">
          <form className="grid gap-3 w-[100%] relative mx-auto">
            <input
              placeholder={title}
              className="w-[90%] h-10 border-2 border-gray-200 px-3 py-1"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className="w-[95%] relative">
              <CKEditor
                editor={ClassicEditor}
                data={body}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setBody(data);
                }}
              />
            </div>
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
                onClick={() => editPage()}
                className="btn_green"
                disabled={states.loading}
              >
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
