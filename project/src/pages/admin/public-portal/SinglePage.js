import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import EditPage from "../../../components/admin/public-portal/EditPage";
import RemovePage from "../../../components/admin/public-portal/RemovePage";
import API_URL from "../../../Url";

function SinglePage() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [page, setPage] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const section = sessionStorage.getItem("section");
  const name = sessionStorage.getItem("page");
  const [editPageModal, setEditPageModal] = useState(false);
  const [removePageModal, setRemovePageModal] = useState(false);
  const [edit, setEdit] = useState({});

  //load pages
  useEffect(() => {
    const getPage = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `${API_URL.user}/pages/page/${section}/${name}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setPage(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getPage();
  }, [name, section, user.jwt_token]);

  const editContent = (page) => {
    setEdit(page);
    setEditPageModal(true);
  };

  const removePage = (page) => {
    setEdit(page);
    setRemovePageModal(true);
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
        <div className="py-2 px-5">
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>{states.errMsg}</div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div className="all_heading text-left mx-0 items-start">
                  <h1>{section}</h1>
                </div>
                {page?.icon && (
                  <div>
                    <img
                      src={`${API_URL.user}/${page?.icon.substring(
                        page?.icon?.indexOf("uploads/")
                      )}`}
                      alt="default"
                      className="object-cover h-[30px] w-[30px] rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col ">
                    <div className="flex items-start justify-between">
                      <p className="text-lg font-bold text-[#1f1f1f]">
                        <span className="font-normal mr-2">Title:</span>
                        {page?.title}
                      </p>
                      {user.superadmin && (
                        <div className="flex gap-3 ">
                          <button
                            className="px-2 p-1 border-gray_bg bg-[#cbffdd] rounded-sm text-red-60"
                            onClick={() => editContent(page)}
                          >
                            <FaRegEdit />
                          </button>

                          <button
                            onClick={() => removePage(page)}
                            className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-base">
                      <span className="mr-2">Body:</span>
                      <span
                        className="text-xs md:text-base"
                        dangerouslySetInnerHTML={{ __html: page?.body }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {editPageModal && (
            <EditPage
              setEditPageModal={setEditPageModal}
              section={section}
              edit={edit}
            />
          )}
          {removePageModal && (
            <RemovePage
              setRemovePageModal={setRemovePageModal}
              section={section}
              edit={edit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
