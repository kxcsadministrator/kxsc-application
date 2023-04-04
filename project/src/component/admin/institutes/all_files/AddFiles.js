import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../../context/Context";
import { useForm } from "react-hook-form";

function AddFiles({ setAddFileModal, instituteId }) {
  const { user } = useContext(Context);
  const [file, setFile] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
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
    setStates({ loading: true, error: false });
    const formData = new FormData();

    for (let i = 0; i < file.length; i++) {
      formData.append("files", file[i]);
    }

    try {
      const res = await axios.post(
        `http://13.36.208.34:3001/institutes/upload-files/${instituteId}`,
        formData,
        {
          headers: {
            "Context-Type": "multipart/form-data",
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );

      setStates({ loading: false, error: false, success: true });
      console.log(res.data);
      setTimeout(() => {
        setAddFileModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
      setStates({
        loading: false,
        error: true,
        errMsg: err.response.data.message,
        success: false,
      });
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
              onChange={(e) => setFile(e.target.files)}
            />
          </div>
          <div>
            {states.loading ? (
              <div>
                <p className="text-gray-400">Loading...</p>
              </div>
            ) : states.error ? (
              <div>
                <p className="err_text">{states.errMsg}</p>
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
                type="submit"
                className="p-2 bg-[#52cb83] rounded-md w-36 text-white my-3 text-sm md:text-base"
                disabled={states.loading}
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

export default AddFiles;
