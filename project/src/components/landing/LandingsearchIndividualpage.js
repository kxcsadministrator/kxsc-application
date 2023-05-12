import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import Ham from "./Ham";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import ResourceFiles from "../admin/institutes/resources/resource_files/ResourceFiles";
import RequestModalR from "../admin/institutes/resources/RequestModalR";
import "../../pages/admin/resources/resource.css";
import { useNavigate } from "react-router-dom";
import image3 from "../images/about.jpg";
import image4 from "../images/background.jpg";
import image7 from "../images/numbers.webp";
import image5 from "../images/certificate.jpg";
import API_URL from "../../url";

function LandingsearchIndividualpage() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { user, dispatch } = useContext(Context);
  const id = sessionStorage.getItem("resourceId");
  const [searchResource, setSearchResource] = useState("");
  const [resource, setResource] = useState({});
  const [related, setRelated] = useState();
  const [requestModal, setRequestModal] = useState(false);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
    success: false,
  });
  const navigate = useNavigate();

  //requestModal states

  useEffect(() => {
    const getResources = async () => {
      try {
        const res = await axios.get(`${API_URL.resource}/resources/one/${id}`);
        console.log(res.data);
        setResource(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getResources();
    const getRelated = async () => {
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/similar/${id}`
        );
        setRelated(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRelated();
  }, [id]);

  // const publishRequest = async () => {
  //   try {
  //     setStates({ loading: true, error: false });
  //     setRequestModal(true);
  //     const res = await axios({
  //       method: "post",
  //       url: `${API_URL.resource}/resources/request-institute-publish/${resource.id}`,
  //       headers: { Authorization: `Bearer ${user.jwt_token}` },
  //     });
  //     setStates({ loading: false, error: false, success: true });
  //     setTimeout(() => {
  //       setRequestModal(false);
  //       window.location.reload(false);
  //     }, 3000);
  //   } catch (err) {
  //     console.log(err.response);
  //     setStates({
  //       loading: false,
  //       error: false,
  //       errMsg: err.response.data.message,
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <div className="LandingPgTwo">
        <div className="landing-nav bg-light ">
          <div className="na_vv d-flex">
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

        {resource.id ? (
          <div className="grid gap-8 w-[87%] mx-auto">
            <div className="students d-flex">
              <div className="guides">
                <h2>{resource.topic}</h2>
                <div>
                  <div className="flex flex-wrap gap-3  text-sm md:text-[15px] ">
                    <p>By: {resource.author.username}</p>
                    <p>Institute: {resource.institute.name}</p>
                    {resource.rating > 0 && <p>Rating: {resource.rating}/5</p>}
                    <p>Category: {resource.category}</p>
                    <p>
                      Sub-categories:{" "}
                      {resource.sub_categories.map((sub, index) => (
                        <span key={index}>{sub}</span>
                      ))}
                    </p>
                    <p className="">Resource type: {resource.resource_type}</p>
                  </div>
                  <h5>About this resources</h5>
                  {resource.description && (
                    <div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: resource.description,
                        }}
                      ></p>
                    </div>
                  )}
                  <div className="flex flex-col gap-0 w-full">
                    <h1 className="my-2 text-lg md:text-xl lg:text-2xl">
                      Files
                    </h1>
                    <ResourceFiles resource={resource} />
                  </div>
                </div>
                <div className="stu-imagez">
                  {resource.avatar ? (
                    <div>
                      <img
                        src={`${API_URL.resource}/${resource.avatar}`}
                        alt="avatar resource"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="fvv-image">
                      <img
                        src="/default.png"
                        alt="default"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}

                  <div>
                    <button className="stu-btn">Start your free 30 days</button>
                  </div>
                  <div>
                    <button className="stu-btnn">Read preview</button>
                  </div>
                </div>
              </div>
              <div className="stu-image">
                {resource.avatar ? (
                  <div>
                    <img
                      src={`${API_URL.resource}/${resource.avatar}`}
                      alt="avatar resource"
                      className="object-cover h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="fvv-image">
                    <img
                      src="/default.png"
                      alt="default"
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}

                <div>
                  <button className="stu-btn">Start your free 30 days</button>
                </div>
                <div>
                  <button className="stu-btnn">Read preview</button>
                </div>
              </div>
            </div>
            <br />
            <div
              className="horizontal-line"
              style={{ width: "90%", margin: "auto" }}
            ></div>
            <br />

            <div>
              <div className="container">
                <h5>Related to "Student's Guide To Information Technology"</h5>
                <div className="row">
                  <div class="col">
                    <div className="slider">
                      <img src={image4} alt="" />
                      <span className="pub">PUBLICATIONS</span>
                      <h5>The six morning habits of high performance</h5>
                    </div>
                  </div>
                  <div class="col">
                    <div className="slider">
                      <img src={image3} alt="" />
                      <span className="pub">PUBLICATIONS</span>
                      <h5>The six morning habits of high performance</h5>
                    </div>
                  </div>
                  <div class="col">
                    <div className="slider">
                      <img src={image4} alt="" />
                      <span className="pub">PUBLICATIONS</span>
                      <h5>The six morning habits of high performance</h5>
                    </div>
                  </div>
                  <div class="col">
                    <div className="slider">
                      <img src={image5} alt="" />
                      <span className="pub">PUBLICATIONS</span>
                      <h5>The six morning habits of high performance</h5>
                    </div>
                  </div>
                  <div class="col">
                    <div className="slider">
                      <img src={image5} alt="" />
                      <span className="pub">PUBLICATIONS</span>
                      <h5>The six morning habits of high performance</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {requestModal && (
          <RequestModalR states={states} setRequestModal={setRequestModal} />
        )}
      </div>
      <br />

      <Footer />
    </div>
  );
}

export default LandingsearchIndividualpage;
