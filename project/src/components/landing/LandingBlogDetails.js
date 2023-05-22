import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Ham from "./Ham";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Url";

function LandingBlogDetails() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const id = sessionStorage.getItem("blogId");
  const { user, dispatch } = useContext(Context);
  const [searchResource, setSearchResource] = useState([]);

  useEffect(() => {
    const getBlog = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(`${API_URL.user}/blog/one/${id}`);
        setStates({ loading: false, error: false });
        setBlog(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    if (searchResource.length > 0) {
      navigate(`/resourceSearch?query=${searchResource}`);
      sessionStorage.setItem("search", searchResource);
    } else {
      alert("input field is empty");
    }
    window.location.reload(false);
  };

  // const getProfile = () => {
  //   if (user) {
  //     navigate("/admin/profile");
  //   } else {
  //     navigate("/login");
  //   }
  // };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
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
            <Link
              to="/"
              className="nav-bar d-flex mt-2 no-underline text-black"
            >
              <div className="link-image">
                <img src={image6} alt="" />
              </div>
              <div className="nav-txt ">
                <h5>Knowledge Exchange</h5>
              </div>
            </Link>
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
              {/* <div className="profile p-1" onClick={() => getProfile()}>
                <CgProfile />
              </div> */}
              {user ? (
                <div
                  onClick={() => {
                    logout();
                  }}
                  className=" px-2 flex items-center justify-center p-1 bg-[#52cb83] rounded-md w-fit text-sm link text-white"
                >
                  Sign Out
                </div>
              ) : (
                <Link
                  to="/login?from=landing"
                  className=" px-2 flex items-center justify-center p-1 bg-[#52cb83] rounded-md w-fit text-sm link text-white"
                >
                  Sign In
                </Link>
              )}
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

        {/* <div className="four-color bg-light">
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
        </div> */}
        <br />
        <div className="flex flex-col md:gap-3 gap-2 md:w-[70%] w-[90%] mx-auto b_head">
          <h1 className="lg:text-3xl md:2xl text-xl text-center md:text-start ">
            {blog?.title}
          </h1>
          <div className="flex gap-4 items-center text-gray-400 ">
            <p className="mb-1 border-b-[2px] uppercase capitalize">
              By: {blog?.author.username}
            </p>
            <p className="mt-3 h-[20px] w-[2px] bg-gray-400" />
            <p className="mb-1">{blog?.date_created}</p>
          </div>
          <div>
            <img
              src="/default.png"
              alt="default"
              className="object-cover h-[150px] w-full rounded-md"
            />
          </div>
          <p
            className="md:text-lg text-sm  m-2"
            dangerouslySetInnerHTML={{ __html: blog?.body }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingBlogDetails;
