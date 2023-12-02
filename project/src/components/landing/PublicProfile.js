import { useState, useEffect, useContext } from "react";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Ham from "./Ham";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import "rc-pagination/assets/index.css";
import API_URL from "../../Url";

import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

import EditPublicPassword from "../../pages/admin/profile/EditPublicPassword";
import EditPublicPic from "../../pages/admin/profile/EditPublicPic";
import EditPublicUser from "../../pages/admin/profile/EditPublicUser";
import RemovePublicPic from "../../pages/admin/profile/RemovePublicPic";

function PublicProfile() {
  const [searchResource, setSearchResource] = useState("");

  const [allCat, setAllCat] = useState([]);
  const { userPublic, dispatch } = useContext(Context);
  const [types, setTypes] = useState();
  const navigate = useNavigate();
  const [editUserModal, setEditUserModal] = useState(false);
  const [editPassModal, setEditPassModal] = useState(false);
  const [editPicModal, setEditPicModal] = useState(false);
  const [removePicModal, setRemovePicModal] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [editUser, setEditUser] = useState();
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });

  //get categories
  useEffect(() => {
    const getUserDetails = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `${API_URL.user}/users/public/one/${userPublic.id}`,
          {
            headers: {
              Authorization: `Bearer ${userPublic.jwt_token}`,
            },
          }
        );
        setStates({ loading: false, error: false });
        setUserDetails(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    };
    getUserDetails();
  }, [userPublic.id, userPublic.jwt_token]);

  const editBtn = (user) => {
    setEditUser(user);
    setEditUserModal(true);
    console.log(user);
  };

  const changeBtn = (user) => {
    setEditUser(user);
    setEditPassModal(true);
  };

  const editPic = (user) => {
    setEditUser(user);
    setEditPicModal(true);
  };

  const deletePic = (user) => {
    setRemovePicModal(true);
  };

  //get categories
  useEffect(() => {
    const getCategories = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`${API_URL.resource}/categories/all`);
        setStates({ loading: false, error: false });
        setAllCat(res.data);
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    };
    getCategories();
    const getType = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/resource-types`
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
  }, []);

  const handleSubmit = async (e) => {
    if (searchResource.length > 0) {
      navigate(`/resourceSearch?query=${searchResource}`);
      sessionStorage.setItem("search", searchResource);
    } else {
      alert("input field is empty");
    }
    window.location.reload(false);
  };

  const newSearch = (cat) => {
    sessionStorage.setItem("cat", cat);
    navigate(`/search_by_category?${cat}`);
  };

  const getProfile = () => {
    if (userPublic) {
      navigate("/public/profile");
    } else {
      navigate("/login");
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const newType = (name) => {
    sessionStorage.setItem("type", name);
    navigate(`/search_by_type?${name}`);
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

            <div className="sg flex items-center justify-between  p-2">
              {userPublic && (
                <div
                  className="profile p-1 text-xl"
                  onClick={() => getProfile()}
                >
                  <CgProfile />
                </div>
              )}
              {userPublic ? (
                <div
                  onClick={() => {
                    logout();
                  }}
                  className=" px-2 flex items-center justify-center p-1 bg-[#52cb83] rounded-md w-fit text-sm link text-white cursor-pointer"
                >
                  Sign Out
                </div>
              ) : (
                <Link
                  to="/public/login"
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

        <div className="explore_topics">
          <div className="exploretopics d-flex">
            <div className="infotech">
              <div className="py-2 px-4">
                <div className="flex flex-col gap-5 items-center mt-9">
                  <div className="flex flex-col gap-4"></div>
                  <div className="flex flex-col gap-2 lg:text-lg md:-mt-12 w-[90%] md:w-[60%] text-sm md:text-base">
                    <div className="flex gap-3 items-center">
                      <p className="w-[80%] mt-3">
                        <span className="pr-3">First Name:</span>{" "}
                        {userDetails.first_name}
                      </p>
                    </div>
                    <div className="dash bg-gray-200 -mt-1" />
                    <div className="flex gap-3 items-center">
                      <p className="w-[80%] ">
                        <span className="pr-3">Last Name:</span>{" "}
                        {userDetails.last_name}
                      </p>
                    </div>
                    <div className="dash  bg-gray-200" />
                    <div className="flex gap-3 items-center">
                      <p className="w-[80%]">
                        <span className="pr-3">Phone Number:</span>{" "}
                        {userDetails.phone}
                      </p>
                    </div>
                    <div className="dash  bg-gray-200 -mt-1" />
                    <div className="flex gap-3 items-center">
                      <p className="w-[80%] ">
                        <span className="pr-3">Email:</span> {userDetails.email}
                      </p>
                    </div>
                    <div className="dash  bg-gray-200 -mt-1 " />
                    <div className="flex gap-3 items-center">
                      <p className="w-[80%]">
                        <span className="pr-3">User Name:</span>
                        {userDetails.username}
                      </p>
                    </div>
                    <div className="dash  bg-gray-200 -mt-1" />
                    <div className="flex justify-between items-center">
                      <button
                        className="btn_green border-2 rounded-md w-fit"
                        onClick={() => editBtn(userPublic)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn_green bg-[#656665]  border-2 rounded-md  w-fit"
                        onClick={() => changeBtn(userPublic)}
                      >
                        change password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {editUserModal && (
                <EditPublicUser
                  setEditUserModal={setEditUserModal}
                  editUser={editUser}
                  userDetails={userDetails}
                />
              )}
              {editPassModal && (
                <EditPublicPassword
                  setEditPassModal={setEditPassModal}
                  editUser={editUser}
                />
              )}
              {editPicModal && (
                <EditPublicPic
                  setEditPicModal={setEditPicModal}
                  editUser={editUser}
                  userDetails={userDetails}
                />
              )}
              {removePicModal && (
                <RemovePublicPic setRemovePicModal={setRemovePicModal} />
              )}
            </div>
            <div className="info--techss -mt-10  md:max-w-[400px] max-w-[99vw] hidden">
              <div className="in4mation">
                <h5>Explore Categories</h5>
              </div>
              <div className="top-buttons d-flex gap-3 flex-wrap ">
                {allCat?.map((cat, index) => (
                  <div key={index}>
                    <button
                      className="tech__btn"
                      onClick={() => newSearch(cat.name)}
                    >
                      {cat.name}
                    </button>
                  </div>
                ))}
              </div>
              <div className="bl-line"></div>
              <div className="browseby">
                <h5>Browse by</h5>
              </div>
              <div className="brow">
                <div>
                  {types?.map((type, index) => (
                    <h5
                      key={index}
                      onClick={() => newType(type.name)}
                      className="cursor-pointer"
                    >
                      {type.name}
                    </h5>
                  ))}
                </div>
              </div>
              <br />
            </div>

            <div className="info--tech mt-5  md:max-w-[400px] max-w-[99vw]">
              <div className="in4mation">
                <h5>Categories</h5>
              </div>
              <div className="top-buttons d-flex gap-3 flex-wrap  max-h-[300px] overflow-y-auto">
                {allCat.map((cat, index) => (
                  <div key={index}>
                    <button
                      className="tech__btn"
                      onClick={() => newSearch(cat.name)}
                    >
                      {cat.name}
                    </button>
                  </div>
                ))}
              </div>
              <hr />

              <div className="browseby">
                <h5>Browse by</h5>
              </div>
              <div className="brow">
                <div>
                  {types?.map((type, index) => (
                    <h5
                      key={index}
                      onClick={() => newType(type.name)}
                      className="cursor-pointer"
                    >
                      {type.name}
                    </h5>
                  ))}
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PublicProfile;
