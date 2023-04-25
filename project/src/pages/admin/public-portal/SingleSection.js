import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import AddPageModal from "../../../components/admin/public-portal/AddPageModal";
import EditPage from "../../../components/admin/public-portal/EditPage";
import RemovePage from "../../../components/admin/public-portal/RemovePage";

function SingleSection() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const section = sessionStorage.getItem("section");
  const [addPageModal, setAddPageModal] = useState(false);
  const [editPageModal, setEditPageModal] = useState(false);
  const [removePageModal, setRemovePageModal] = useState(false);
  const [edit, setEdit] = useState({});

  //load pages
  useEffect(() => {
    const getPages = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `http://15.188.62.53:3000/pages/section/${section}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setPages(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getPages();
  }, [section, user.jwt_token]);

  const editContent = (section) => {
    setEdit(section);
    setEditPageModal(true);
  };

  const removePage = (section) => {
    setEdit(section);
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
              <div className="all_heading">
                <h1>{section}</h1>
                <button
                  className="btn_green"
                  onClick={() => setAddPageModal(true)}
                >
                  Add Pages
                </button>
              </div>
              {pages.children?.length > 0 ? (
                <div>
                  {pages.children?.map((section, index) => (
                    <div className="flex flex-col gap-6" key={index}>
                      <div className="flex flex-col ">
                        <div className="flex items-start justify-between">
                          <p className="text-lg font-bold text-[#1f1f1f]">
                            <span className="font-normal mr-2">Title:</span>
                            {section.title}
                          </p>
                          {user.superadmin && (
                            <div className="flex gap-3 ">
                              <button
                                className="px-2 p-1 border-gray_bg bg-[#cbffdd] rounded-sm text-red-60"
                                onClick={() => editContent(section)}
                              >
                                <FaRegEdit />
                              </button>

                              <button
                                onClick={() => removePage(section)}
                                className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                              >
                                <RiDeleteBinLine />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-base">
                          <span className="mr-2">Body:</span>
                          {section.body}
                        </p>
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3 -mt-5" />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p>No Section Pages</p>
                </div>
              )}
            </div>
          )}
          {addPageModal && (
            <AddPageModal setAddPageModal={setAddPageModal} section={section} />
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

export default SingleSection;
