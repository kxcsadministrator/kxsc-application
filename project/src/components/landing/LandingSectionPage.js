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
import API_URL from "../../url";

function LandingSectionPage() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [page, setPage] = useState([]);
  const navigate = useNavigate();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const section = sessionStorage.getItem("section");
  const name = sessionStorage.getItem("page");
  const { user, dispatch } = useContext(Context);
  const [searchResource, setSearchResource] = useState([]);
  useEffect(() => {
    const getPage = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `${API_URL.user}/pages/page/${section}/${name}`
        );
        setStates({ loading: false, error: false });
        setPage(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getPage();
  }, [name, section]);

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
        {/* 
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
        </div> */}
        <br />
        <div className="flex flex-col md:gap-3 gap-2 md:w-[70%] w-[90%] mx-auto b_head">
          <h1 className="lg:text-3xl md:2xl text-xl text-center md:text-start ">
            {page?.title}
          </h1>
          <p
            className="md:text-lg text-base  m-2"
            dangerouslySetInnerHTML={{ __html: page?.body }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingSectionPage;
