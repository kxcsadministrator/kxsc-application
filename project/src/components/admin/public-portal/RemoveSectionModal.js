import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";

function RemoveSectionModal({ setRemoveSection, editSection }) {
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
        setRemoveSection(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setRemoveSection]);

  const submitRemoveSection = async () => {
    setStates({ loading: true, error: false, success: false });
    try {
      const res = await axios.delete(
        `http://15.188.62.53:3000/pages/delete-section/${editSection.name}`,
        {
          headers: {
            Authorization: `Bearer ${user.jwt_token}`,
          },
        }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setRemoveSection(false);
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
      <div className="modal_content" ref={menuRef}>
        <h1 className="font-bold text-[20px] border-b-2 border-b-gray w-full text-center  pb-2">
          Delete Section
        </h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <p>Are you sure you want to remove Section {editSection.name}</p>
          </div>
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
            <div className="flex items-center gap-5">
              <button
                onClick={() => setRemoveSection(false)}
                className="btn_green"
                disabled={states.loading}
              >
                Back
              </button>
              <button
                onClick={() => submitRemoveSection()}
                className="btn_red"
                disabled={states.loading}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemoveSectionModal;
