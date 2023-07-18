import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddPageModal from "../../../components/admin/public-portal/AddPageModal";
import API_URL from "../../../Url";

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
  const [edit, setEdit] = useState({});

  //load pages
  useEffect(() => {
    const getPages = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `${API_URL.user}/pages/section/${section}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setPages(res.data);
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

  const navPage = (page) => {
    sessionStorage.setItem("page", page.title);
    navigate(`/admin/sections/${section}/${page.title}`);
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
                  {pages.children?.map((page, index) => (
                    <div className="flex flex-col gap-6" key={index}>
                      <div className="flex flex-col ">
                        <div className="flex items-start justify-between">
                          <p className="text-lg font-bold text-[#1f1f1f]">
                            <span className="font-normal mr-2">Title:</span>
                            {page.title}
                          </p>
                        </div>
                        <p
                          className="text-sm ml-2 text-green_bg cursor-pointer hover:text-gray-400 -mt-2"
                          onClick={() => navPage(page)}
                        >
                          View pages
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
        </div>
      </div>
    </div>
  );
}

export default SingleSection;
