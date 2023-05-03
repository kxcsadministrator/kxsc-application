import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import image from "../images/beach.webp";
import ModalTwo from "./ModalTwo";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import { AiOutlineStar } from "react-icons/ai";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Ham from "./Ham";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function LandingsearchResult() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchResource, setSearchResource] = useState("");
  const [allCat, setAllCat] = useState([]);
  const { user, dispatch } = useContext(Context);

  const [resources, setResources] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const navigate = useNavigate();

  const search = sessionStorage.getItem("search");

  //get categories
  useEffect(() => {
    const getResources = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `http://15.188.62.53:3002/resources/search?query=${search}`
        );
        setStates({ loading: false, error: false });
        setResources(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
        setStates({
          loading: false,
          error: true,
          errMsg: err.response.data.errors
            ? err.response.data.errors[0].msg
            : err.response.data.message,
        });
      }
    };
    getResources();

    const getCategories = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`http://15.188.62.53:3002/categories/all`);
        setStates({ loading: false, error: false });
        setAllCat(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
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
  }, [search]);
  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(resources.slice(0, countPerPage))
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(resources.slice(from, to)));
    },
    [resources]
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

  const newSearch = (cat) => {
    sessionStorage.setItem("cat", cat);
    navigate(`/search_by_category?${cat}`);
  };

  const getDetails = (id) => {
    sessionStorage.setItem("resourceId", id);
    navigate(`/resource_details?${id}`);
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
        {/* <div className="main-dropdown">
          <div className="drop d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Best match
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Types
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Category
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div> */}
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
        <div className="explore_topics">
          <div className="exploretopics d-flex">
            <div className="infotech">
              <div className="in4mation">
                {/* <h5>Information Technology</h5> */}
              </div>
              <div className="five-vid d-flex">
                {resources?.length > 0 ? (
                  <div>
                    {collection.map((resource, index) => (
                      <div>
                        <div
                          className="five-vid d-flex cursor-pointer"
                          key={index}
                          onClick={() => getDetails(resource._id)}
                        >
                          {resource.avatar ? (
                            <div>
                              <img
                                src={`http://15.188.62.53:3002/${resource.avatar}`}
                                alt="avatar resource"
                                className="object-cover h-full w-full"
                              />
                            </div>
                          ) : (
                            <div className="fvv-image w-[28%]">
                              <img
                                src="/default.png"
                                alt="default"
                                className="object-cover h-full w-full"
                              />
                            </div>
                          )}

                          <div className="fv-vid p-3">
                            <span>{resource.institute.name}</span>
                            <h5>{resource.topic}</h5>
                            <p>By: {resource.author.username}</p>
                            <h3 className="dates">{resource.date}</h3>
                            <div className="saves d-flex gap-3">
                              {resource.rating <= 0 ? (
                                <p></p>
                              ) : (
                                <div className="sa_ve-btn">
                                  <span>Rating: {resource.rating}</span>
                                </div>
                              )}

                              {/* <button className="sa_ve-btn">
                            <AiOutlineShareAlt />
                            Share Time
                          </button> */}
                            </div>
                          </div>
                        </div>
                        {/* <div className="mobile___dropdown">
                      <div className="mobile--buttons d-flex gap-2">
                        <button type="button" class="btn btn-secondary">
                          Save
                        </button>
                        <button type="button" class="btn btn-secondary">
                          Viewed by
                        </button>
                        <button type="button" class="btn btn-secondary">
                          Share time
                        </button>
                      </div>
                    </div> */}
                        <br />
                        <div className="bl-line"></div>
                        <br />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>No Resources with the name {resources}</p>
                  </div>
                )}
              </div>
              <br />
              <div className="info--techss">
                {/*
                <div className="in4mation">
                    <h5>Explore Topics</h5>
                </div>
                <div className="top-buttons d-flex gap-3">
                  <div>
                    <button className="tech__btn">Security</button>
                  </div>
                  <div>
                    <button className="tech__btn">Business</button>
                  </div>
                </div>
                <div className="top-buttons d-flex gap-3">
                  <div>
                    <button className="tech__btn">Technology</button>
                  </div>
                  <div>
                    <button className="tech__btn">Production</button>
                  </div>
                </div>
                <div className="top-buttons d-flex gap-3">
                  <div>
                    <button className="tech__btn">Science</button>
                  </div>
                  <div>
                    <button className="tech__btn">Business</button>
                  </div>
                </div>
                <div className="top-buttons d-flex gap-3">
                  <div>
                    <button className="tech__btn">Manufacturing</button>
                  </div>
                  <div>
                    <button className="tech__btn">Creative</button>
                  </div>
                </div> */}
                <div className="bl-line"></div>
                <div className="browseby">
                  <h5>Browse by</h5>
                </div>
                <div className="brow">
                  <div>
                    {allCat.map((cat, index) => (
                      <h5 key={index} onClick={() => newSearch(cat.name)}>
                        {cat.name}
                      </h5>
                    ))}
                  </div>
                </div>
                <br />
              </div>
              <div className="in4mation">
                {/* <div className="sgg p-2">
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <ModalTwo />
                  </Modal.Body>
                </Modal>

                <Button variant="primary" onClick={handleShow}>
                  Sign up
                </Button>
              </div> */}
                <div className="paginate my-4">
                  {resources > countPerPage && (
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage}
                      current={currentPage}
                      total={resources.length}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="info--tech">
              {/* <div className="in4mation">
                <h5>Explore Topics</h5>
              </div>
              <div className="top-buttons d-flex gap-3">
                <div>
                  <button className="tech__btn">Security</button>
                </div>
                <div>
                  <button className="tech__btn">Business</button>
                </div>
              </div>
              <div className="top-buttons d-flex gap-3">
                <div>
                  <button className="tech__btn">Technology</button>
                </div>
                <div>
                  <button className="tech__btn">Production</button>
                </div>
              </div>
              <div className="top-buttons d-flex gap-3">
                <div>
                  <button className="tech__btn">Science</button>
                </div>
                <div>
                  <button className="tech__btn">Business</button>
                </div>
              </div>
              <div className="top-buttons d-flex gap-3">
                <div>
                  <button className="tech__btn">Manufacturing</button>
                </div>
                <div>
                  <button className="tech__btn">Creative</button>
                </div>
              </div> */}
              <hr />

              <div className="browseby">
                <h5>Browse by</h5>
              </div>
              <div className="brow">
                <div>
                  {allCat.map((cat, index) => (
                    <h5 key={index} onClick={() => newSearch(cat.name)}>
                      {cat.name}
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

export default LandingsearchResult;
