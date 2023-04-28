import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Ham from "./Ham";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function LandingBlog() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const { user } = useContext(Context);
  const [searchResource, setSearchResource] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`http://15.188.62.53:3000/blog/all`, {});
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
  }, []);

  const navBlog = (blog) => {
    sessionStorage.setItem("blogId", blog._id);
    navigate(`/blog/${blog.title}`);
  };

  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(blogs.slice(0, countPerPage))
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(blogs.slice(from, to)));
    },
    [blogs]
  );

  //useEffect Search
  useEffect(() => {
    updatePage(1);
  }, [updatePage]);

  const handleSubmit = async (e) => {
    if (searchResource.length > 0) {
      navigate(`/resourceSearch?query=${searchResource}`);
      sessionStorage.setItem("search", searchResource);
    } else {
      alert("input field is empty");
    }
    window.location.reload(false);
  };

  const getProfile = () => {
    if (user) {
      navigate("/admin/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="PageFive">
        <div
          className="landing-nav bg-light"
          style={{ position: "sticky", top: "0" }}
        >
          <div className="navv-vv d-flex">
            <div className="hamburger--menu">
              <Ham />
            </div>
            <div className="nav-bar d-flex mt-2">
              <div className="link-image">
                <img src={image6} alt="" />
              </div>
              <div className="nav-txt">
                <h5>Knowledge Exchange</h5>
              </div>
            </div>
            <div className="inputt p-2">
              <form className="input-group" onSubmit={(e) => handleSubmit(e)}>
                <span className="in-search bg-light input-group-text">
                  Learning
                </span>

                <input
                  type="text"
                  className="form-control"
                  aria-label="Dollar amount (with dot and two decimal places)"
                  placeholder="Search skills, subjects or software"
                  value={searchResource}
                  onChange={(e) => setSearchResource(e.target.value)}
                />
                <button
                  className="in-search bg-light input-group-text"
                  type="submit"
                >
                  <IoIosSearch />
                </button>
              </form>
            </div>

            <div className="sg d-flex  p-2">
              <div className="profile p-1" onClick={() => getProfile()}>
                <CgProfile />
              </div>
              <Link
                to="/login"
                type="button"
                class=" px-2 flex items-center justify-center p-1 bg-[#52cb83] rounded-md w-fit text-sm link text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="inputtt p-2">
          <form className="input-group" onSubmit={(e) => handleSubmit(e)}>
            <span className="in-search bg-light input-group-text">
              Learning
            </span>

            <input
              type="text"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              placeholder="Search skills, subjects or software"
              value={searchResource}
              onChange={(e) => setSearchResource(e.target.value)}
            />
            <button
              className="in-search bg-light input-group-text"
              type="submit"
            >
              <IoIosSearch />
            </button>
          </form>
        </div>

        <div className="four-color bg-light">
          <div className="dd-d d-flex gap-3 pt-3">
            <div>
              <h5>Research for:</h5>
            </div>
            <div>
              <h5>Business</h5>
            </div>
            <div>
              <h5>Higher Education</h5>
            </div>
            <div>
              <h5>Government</h5>
            </div>
          </div>
        </div>
        <br />
        {blogs?.length > 0 ? (
          <div className="flex md:flex-row flex-col gap-4 justify-between w-[80%] mx-auto flex-wrap">
            {collection.map((blog, index) => (
              <div
                className="lg:w-[28%] md:w-[35%] w-full flex flex-col gap-3 p-3 shadow-sm bg-white min-w-[250px] md:min-h-[300px] min-h-fit"
                key={index}
                onClick={() => navBlog(blog)}
              >
                <div className="w-full">
                  <img
                    src="/default.png"
                    alt="default"
                    className="object-cover w-full rounded-md"
                  />
                </div>
                <div className="flex flex-col w-[90%] mx-auto">
                  <p className="text-[15px] text-gray-400">{blog.date}</p>
                  <h6 className="text-[20px] font-bold">{blog.title}</h6>
                  <p
                    className="text-sm m-2 blog_text"
                    dangerouslySetInnerHTML={{ __html: blog.body }}
                  />
                  <p className="text-green-400 text-sm cursor-pointer">
                    Read More
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No Articles</p>
          </div>
        )}
      </div>

      <div className="in4mation">
        <div className="paginate my-4">
          {blogs > countPerPage && (
            <Pagination
              pageSize={countPerPage}
              onChange={updatePage}
              current={currentPage}
              total={blogs.length}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingBlog;
