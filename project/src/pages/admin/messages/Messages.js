import { useContext, useEffect, useState, useCallback } from "react";
import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import axios from "axios";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import DeleteMsg from "../../../component/admin/users/DeleteMsg";

function Messages() {
  //states
  const { user } = useContext(Context);
  const [allMsg, setAllMsg] = useState([]);
  const [message, setMessage] = useState();
  const [deleteMsgModal, setDeleteMsgModal] = useState(false);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `http://52.47.163.4:3000/messages/my-messages`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setAllMsg(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          error: false,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    };
    getMessages();
  }, [user.jwt_token, user.superadmin]);
  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allMsg.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allMsg
          .filter((item) => item.body.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [allMsg]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allMsg.slice(from, to)));
    },
    [allMsg]
  );

  //useEffect Search
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      setCurrentPage(1);
      searchData(value);
    }
  }, [value, updatePage, searchData]);

  const deleteMsg = (msg) => {
    setMessage(msg);
    setDeleteMsgModal(true);
  };

  return (
    <div className="base_container">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-5 px-5">
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>
              <p>{states.errMsg}</p>
            </div>
          ) : allMsg.length === 0 ? (
            <div>
              <p>{states.errMsg}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="all_heading">
                <h1>All Messages</h1>
                <div>
                  <input
                    placeholder="Search Messages"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              {collection.length > 0 ? (
                <div>
                  {collection.map((msg, index) => (
                    <div className="grid gap-6" key={index}>
                      <div className="flex flex-col ">
                        <div className="flex justify-between items-center">
                          <p className="text-base font-bold text-[#1f1f1f]">
                            {msg.subject}
                          </p>
                          <p className="text-sm text-[#1f1f1f]">
                            {msg.sender.username}
                          </p>
                        </div>

                        <div dangerouslySetInnerHTML={{ __html: msg.body }} />

                        <p className="flex gap-1 items-center -mt-1">
                          <button
                            className="px-2 mt-4 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                            onClick={() => deleteMsg(msg)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </p>
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                    </div>
                  ))}
                  <div className="paginate my-4">
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage}
                      current={currentPage}
                      total={allMsg.length}
                    />
                  </div>
                  {deleteMsgModal && (
                    <DeleteMsg
                      setDeleteMsgModal={setDeleteMsgModal}
                      message={message}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <p>No Messages</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
