import { useEffect, useRef, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../../context/Context";

function AddSubCat({ setAddSubCatModal, category }) {
  //states
  const { user } = useContext(Context);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const [sub, setSub] = useState("");
  let menuRef = useRef();

  //set modal false
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setAddSubCatModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAddSubCatModal]);

  //submit subCat
  const submitSubCat = async () => {
    if (sub.length == 0) {
      setStates({
        loading: false,
        error: true,
        errMsg: "sub category input field is empty",
      });
    } else {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.patch(
          `http://15.188.62.53:3002/categories/add-subcategories/${category._id}`,
          { sub_categories: [sub] },
          { headers: { Authorization: `Bearer ${user.jwt_token}` } }
        );
        setStates({ loading: false, error: false, success: true });
        setTimeout(() => {
          setAddSubCatModal(false);
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
    }
  };

  return (
    <div className="modal_container">
      <div className="modal_content" ref={menuRef}>
        <h1 className="modal_heading">Add Sub-categories</h1>
        <div className="flex flex-col items-center w-full gap-3">
          <form>
            <input
              placeholder="Sub-category"
              className="single_input"
              value={sub}
              onChange={(e) => {
                setSub(e.target.value);
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

            <button onClick={() => submitSubCat()} className="btn_green">
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubCat;
