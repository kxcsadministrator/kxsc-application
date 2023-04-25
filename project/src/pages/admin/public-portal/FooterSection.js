import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import EditSectionModal from "../../../components/admin/public-portal/EditSectionModal";
import RemoveSectionModal from "../../../components/admin/public-portal/RemoveSectionModal";

function FooterSection() {
  //states
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [editSectionModal, setEditSectionModal] = useState(false);
  const [editSection, setEditSection] = useState({});
  const [removeSection, setRemoveSection] = useState(false);

  //get sections
  useEffect(() => {
    const getSections = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `http://15.188.62.53:3000/pages/all-sections`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setSections(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getSections();
  }, [user.jwt_token]);

  const sectionEdit = (section) => {
    setEditSectionModal(true);
    setEditSection(section);
  };

  const sectionDelete = (section) => {
    setRemoveSection(true);
    setEditSection(section);
  };
  const navPage = (section) => {
    sessionStorage.setItem("section", section.name);
    navigate(`/admin/sections/${section.name}`);
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
                <h1>All Section Headers</h1>
              </div>
              {sections.length > 0 ? (
                <div>
                  {sections?.map((section, index) => (
                    <div className="flex flex-col gap-6" key={index}>
                      <div className="flex flex-col ">
                        <div className="flex items-start justify-between">
                          <p className="text-base font-bold text-[#1f1f1f]">
                            {section.name}
                          </p>
                          {user.superadmin && (
                            <div className="flex gap-3 ">
                              <button
                                className="px-2 p-1 border-gray_bg bg-[#cbffdd] rounded-sm text-red-60"
                                onClick={() => sectionEdit(section)}
                              >
                                <FaRegEdit />
                              </button>

                              <button
                                onClick={() => sectionDelete(section)}
                                className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                              >
                                <RiDeleteBinLine />
                              </button>
                            </div>
                          )}
                        </div>

                        <p
                          className="text-sm ml-2 text-green_bg cursor-pointer hover:text-gray-400 -mt-2"
                          onClick={() => navPage(section)}
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
                  <p>No Section Headers</p>
                </div>
              )}
            </div>
          )}
          {editSectionModal && (
            <EditSectionModal
              setEditSectionModal={setEditSectionModal}
              editSection={editSection}
            />
          )}
          {removeSection && (
            <RemoveSectionModal
              setRemoveSection={setRemoveSection}
              editSection={editSection}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FooterSection;
