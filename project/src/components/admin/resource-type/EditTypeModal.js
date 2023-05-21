import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import API_URL from "../../../Url";

function EditTypeModal({ setEditTypeModal, type }) {
  //states
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const [newType, setNewType] = useState(type.name);
  let menuRef = useRef();

  //set modal false
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setEditTypeModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setEditTypeModal]);

  //submit subCat
  const submitType = async () => {
    setStates({ loading: true, error: false });
    try {
      const res = await axios.patch(
        `${API_URL.resource}/resources/rename-type/${type._id}`,
        { name: newType },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setEditTypeModal(false);
        window.location.reload(false);
      }, 3000);
    } catch (err) {
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
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Edit Type Name</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder={newType}
              className="single_input"
              value={newType}
              onChange={(e) => {
                setNewType(e.target.value);
              }}
            />
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

            <button onClick={() => submitType()} className="btn_green">
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTypeModal;
