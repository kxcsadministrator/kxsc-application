import { useEffect, useRef } from "react";

function RequestModalR({ states, setRequestModal }) {
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
        ) : states.err ? (
          <div>
            <p className="text-red-400 text-3xl text-center">{states.errMsg}</p>
          </div>
        ) : states.success ? (
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

export default RequestModalR;
