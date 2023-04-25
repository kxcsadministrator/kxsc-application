import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../../context/Context";
import { useForm } from "react-hook-form";

function AddResourceFile({ setAddFileModal, resourceId }) {
  const { user } = useContext(Context);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  let menuRef = useRef();

  //
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setAddFileModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAddFileModal]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErr(false);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await axios.post(
        `http://15.188.62.53:3002/resources/upload-files/${resourceId}`,
        formData,
        {
          headers: {
            "Context-Type": "multipart/form-data",
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );

      setLoading(false);
      setSuccess(true);
      console.log(res.data);
      setTimeout(() => {
        setAddFileModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setErr(true);
      setErrMsg(err.response.data.message);
      console.log(err);
    }
  };

  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Add Files
        </h1>
        <form
          className="flex flex-col items-center w-full gap-3"
          onSubmit={submit}
        >
          <div>
            <input
              placeholder="Upload File"
              type="file"
              multiple="multiple"
              filename={file}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div>
            {loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : err ? (
              <div>
                <p className="err_text">{errMsg}</p>
              </div>
            ) : success ? (
              <div>
                <p className="text-green-400">Success</p>
              </div>
            ) : (
              <div></div>
            )}
            <div>
              <button
                type="submit"
                className="bg-green_bg  w-full text-white p-2 rounded-sm"
                disabled={loading}
              >
                Add file
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddResourceFile;
