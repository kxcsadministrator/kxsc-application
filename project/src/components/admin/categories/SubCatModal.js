import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";
import API_URL from "../../../url";

function SubCatModal({ deleteSubCat, setSubCatModal, category }) {
  //states
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
        setSubCatModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setSubCatModal]);

  //submit subCat
  const submitSubCat = async () => {
    setStates({ loading: true, error: false });
    try {
      const res = await axios.patch(
        `${API_URL.resource}/categories/remove-subcategories/${category._id}`,
        { sub_categories: [deleteSubCat] },
        { headers: { Authorization: `Bearer ${user.jwt_token}` } }
      );
      setStates({ loading: false, error: false, success: true });
      setTimeout(() => {
        setSubCatModal(false);
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

      console.log(err);
    }
  };
  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Delete Sub-categories</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <div>
            <p>
              Are you sure you want to delete
              <span className="font-bold ml-2">{deleteSubCat}</span>
            </p>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSubCatModal(false)}
                className="bg-green_bg rounded-sm h-[35px] w-full py-1 px-2 text-white"
              >
                back
              </button>
              <button
                onClick={() => submitSubCat()}
                className="bg-[#d14949] rounded-sm h-[35px] w-full py-1 px-2 text-white"
                disabled={states.loading}
              >
                continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCatModal;
