import { useEffect, useRef } from "react";
import { GrStatusGood } from "react-icons/gr";

function RequestModal({ setRequestModal, states }) {
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
        {states.loading ? (
          <div>
            <p className="text-gray-400 text-3xl text-center">Loading...</p>
          </div>
        ) : states.error ? (
          <div>
            <p className="text-red-400 text-3xl text-center">{states.errMsg}</p>
          </div>
        ) : states.success ? (
          <div className="flex items-center gap-4 text-green-400">
            <GrStatusGood />
            <p className=" text-3xl text-center">Success</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default RequestModal;
