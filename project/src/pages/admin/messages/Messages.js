import { useContext, useEffect, useState, useCallback } from "react";
import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import axios from "axios";
import DeleteResources from "../../../component/admin/institutes/resources/DeleteResources";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

function Messages() {
  const { user } = useContext(Context);
  const [allMsg, setAllMsg] = useState([]);
  const [states, setStates] = useState({
    loading: true,
    error: false,
    errMsg: "",
  });
  const [value, setValue] = useState("");

  useEffect(() => {
    const getMessages = async () => {
      setStates({ loading: true, error: false });
      if (user.superadmin) {
        try {
          const res = await axios.get("http://13.36.208.80:3000/messages/all", {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          });
          setStates({ loading: false, error: false });
          setAllMsg(res.data);
          console.log(res.data);
        } catch (err) {
          setStates({
            loading: false,
            error: false,
            errMsg: err.response.data.message,
          });
        }
      } else {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3000/messages/my-messages",
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
            errMsg: err.response.data.message,
          });
          console.log(err);
        }
      }
    };
    getMessages();
  }, [user.jwt_token]);
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

  const handleDelete = () => {};

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
                        <p className="text-base font-bold text-[#1f1f1f]">
                          {msg.subject}
                        </p>
                        <p className="text-sm -mt-3">{msg.body}</p>
                        {/* 
                          <p className="flex gap-1 items-center -mt-1">
                            <button
                              onClick={() => viewMsg(msg)}
                              className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                            >
                              <FaEye />
                            </button>
                            {user.superadmin && (
                              <button
                                className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                                onClick={() => deleteMsg(msg)}
                              >
                                <RiDeleteBinLine />
                              </button>
                            )}
                          </p>
                          */}
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
                </div>
              ) : (
                <div>
                  <p>No resource</p>
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
