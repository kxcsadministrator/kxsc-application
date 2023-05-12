import Topbar from "../../../components/admin/Topbar";
import Sidebar from "../../../components/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import EditBlogModal from "../../../components/admin/blog/EditBlogModal";
import API_URL from "../../../url";

function SingleBlog() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const id = sessionStorage.getItem("blogId");
  const [editBlogModal, setEditBlogModal] = useState(false);
  const [edit, setEdit] = useState();

  useEffect(() => {
    const getBlog = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(`${API_URL.user}/blog/one/${id}`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setStates({ loading: false, error: false });
        setBlog(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getBlog();
  }, [id, user.jwt_token]);

  const editBlog = (blog) => {
    setEdit(blog);
    setEditBlogModal(true);
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
              <div className="">
                <h1 className="text-center text-xl md:text-3xl">
                  {blog?.title}
                </h1>
              </div>
              <div className="flex flex-col ">
                <div className="flex items-start justify-between -mt-2">
                  <p className="text-lg font-bold text-[#6f6d6d]">
                    <span className="font-normal mr-2">By:</span>
                    {blog?.author.username}
                  </p>
                  {user.superadmin && (
                    <div className="flex gap-3 ">
                      <button
                        className="px-2 p-1 border-gray_bg bg-[#cbffdd] rounded-sm text-red-60"
                        onClick={() => editBlog(blog)}
                      >
                        <FaRegEdit />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-base">
                  <span className="mr-2">Body:</span>
                  <span
                    className="text-xs md:text-base"
                    dangerouslySetInnerHTML={{ __html: blog?.body }}
                  />
                </p>
              </div>
            </div>
          )}
          {editBlogModal && (
            <EditBlogModal
              setEditBlogModal={setEditBlogModal}
              edit={edit}
              id={id}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleBlog;
