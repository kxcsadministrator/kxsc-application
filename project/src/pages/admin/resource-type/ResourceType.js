import Topbar from "../../../components/admin/Topbar";
import Sidebar from "../../../components/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

import API_URL from "../../../Url";
import EditTypeModal from "../../../components/admin/resource-type/EditTypeModal";
import DeleteType from "../../../components/admin/resource-type/DeleteType";

function ResourceType() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [types, setTypes] = useState();
  const [editTypeModal, setEditTypeModal] = useState(false);
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  const [type, setType] = useState();

  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });

  useEffect(() => {
    const getType = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/resource-types`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setTypes(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getType();
  }, [user.jwt_token]);

  const deleteType = (type) => {
    setType(type);
    setDeleteTypeModal(true);
  };

  const editType = (type) => {
    setType(type);
    setEditTypeModal(true);
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>{states.errMsg}</div>
          ) : (
            <div className="flex flex-col gap-8 mt-3">
              {types?.length > 0 ? (
                <div>
                  {types.map((type, index) => (
                    <div className="grid gap-3" key={index}>
                      <div className="flex justify-between">
                        <p className="text-base font-bold text-[#1f1f1f]">
                          {type.name}
                        </p>
                        {user.superadmin && (
                          <p className="flex gap-1 items-center -mt-1">
                            <button
                              className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                              onClick={() => editType(type)}
                            >
                              <FaRegEdit />
                            </button>

                            <button
                              className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                              onClick={() => deleteType(type)}
                            >
                              <RiDeleteBinLine />
                            </button>
                          </p>
                        )}
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p>No Resource Type</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          {editTypeModal && (
            <EditTypeModal setEditTypeModal={setEditTypeModal} type={type} />
          )}
          {deleteTypeModal && (
            <DeleteType setDeleteTypeModal={setDeleteTypeModal} type={type} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceType;
