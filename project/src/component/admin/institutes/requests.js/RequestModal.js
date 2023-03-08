import { useEffect, useRef } from "react";

function RequestModal({ setRequestModal, loading, errMsg, err, success }) {
  let menuRef = useRef();
  //function removes modal when dom is clicked
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setRequestModal(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setRequestModal]);

  return (
    <div className="modal_container">
      <div className="modal_content min-h-[25%]" ref={menuRef}>
        {loading ? (
          <div>
            <p className="text-gray-400 text-3xl text-center">Loading...</p>
          </div>
        ) : err ? (
          <div>
            <p className="text-red-400 text-3xl text-center">{errMsg}</p>
          </div>
        ) : success ? (
          <div>
            <p className="text-green-400 text-3xl text-center">Success</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default RequestModal;
