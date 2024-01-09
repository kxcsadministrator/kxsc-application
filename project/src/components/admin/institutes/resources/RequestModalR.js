import { useEffect, useRef } from "react";
import { VscPassFilled } from "react-icons/vsc";

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
      <div
        className="modal_content min-h-[25%] p-3 flex flex-col  items-center justify-center "
        ref={menuRef}
      >
        {states.loading ? (
          <div>
            <p className="text-gray-400 text-3xl text-center">Loading...</p>
          </div>
        ) : states.error ? (
          <div>
            <p className="text-red-400 text-3xl text-center">{states.errMsg}</p>
          </div>
        ) : states.success ? (
          <div className="flex  items-center justify-center gap-4 text-green-400 ">
            <p className="text-2xl font-semibold text-center">Success</p>
            <p>
              <VscPassFilled size="2rem" />
            </p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default RequestModalR;
