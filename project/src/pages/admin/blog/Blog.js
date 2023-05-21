import Sidebar from "../../../components/admin/Sidebar";
import Topbar from "../../../components/admin/Topbar";
import { useState, useEffect, useContext } from "react";
import { Context } from "../../../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import DeleteBlog from "../../../components/admin/blog/DeleteBlog";
import API_URL from "../../../Url";

function Blog() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [deleteBlogModal, setDeleteBlogModal] = useState(false);
  const [blog, setBlog] = useState();

  useEffect(() => {
    const getBlogs = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`${API_URL.user}/blog/all`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setStates({ loading: false, error: false });
        setBlogs(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getBlogs();
  }, [user.jwt_token]);

  const navBlog = (blog) => {
    sessionStorage.setItem("blogId", blog._id);
    navigate(`/admin/blog/${blog.title}`);
  };

  const deleteBlog = (blog) => {
    setBlog(blog);
    setDeleteBlogModal(true);
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
                <h1>Blogs</h1>
              </div>
              {blogs?.length > 0 ? (
                <div>
                  {blogs.map((blog, index) => (
                    <div className="flex flex-col gap-6" key={index}>
                      <div className="flex flex-col ">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-[#1f1f1f]">
                            <span className="font-normal mr-2">Title:</span>
                            {blog.title}
                          </p>
                          <button
                            onClick={() => deleteBlog(blog)}
                            className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>

                        <p>By: {blog.author.username}</p>
                        <p
                          className="text-sm ml-2 text-green_bg cursor-pointer hover:text-gray-400 -mt-2"
                          onClick={() => navBlog(blog)}
                        >
                          View
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
          {deleteBlogModal && (
            <DeleteBlog setDeleteBlogModal={setDeleteBlogModal} blog={blog} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
