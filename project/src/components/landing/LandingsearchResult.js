import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { ButtonGroup, Dropdown, Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Ham from "./Ham";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import API_URL from "../../Url";
import Rating from "../Rating";

import { MdFormatQuote } from "react-icons/md";
import { BsShareFill } from "react-icons/bs";

function LandingsearchResult() {
  const [show, setShow] = useState(false);
  const [shows, setShows] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleClose = () => setShows(false);
  const handleShow = () => setShow(true);
  const [showCitation, setShowCitation] = useState(false);
  const [searchResource, setSearchResource] = useState("");
  const [allCat, setAllCat] = useState([]);
  const { user, dispatch } = useContext(Context);
  const [types, setTypes] = useState();
  const [citationValues, setCitationValues] = useState([]);

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
          `${API_URL.resource}/resources/search?query=${search}&sort=rating&reverse=true`
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
        const res = await axios.get(`${API_URL.resource}/categories/all`);
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
    const getType = async () => {
      setStates({ loading: true, error: false });
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/resource-types`
        );
        setStates({ loading: false, error: false });
        setTypes(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getType();
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

  //drop down
  const [selectedValue, setSelectedValue] = useState("match");

  const handleSelect = async (value, name) => {
    setSelectedValue(value);
    try {
      const res = await axios.get(
        `${API_URL.resource}/resources/search?query=${search}&sort=${name}&reverse=true`
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

  //share function

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const newType = (name) => {
    sessionStorage.setItem("type", name);
    navigate(`/search_by_type?${name}`);
  };

  const setCite = (citation) => {
    setShowCitation(true);
    if (citation[0].length > 0) {
      setCitationValues(citation);
    } else {
      setCitationValues([]);
    }

    console.log(citationValues);
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
        <div className="main-dropdown my-4">
          <Dropdown as={ButtonGroup}>
            <Button variant="success">
              {selectedValue === "match" ? "Best Match" : ""}
              {selectedValue === "count" ? "View Count" : ""}
              {selectedValue === "new" ? "Newest" : ""}
            </Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelect("match", "rating")}>
                <Form.Check
                  type="radio"
                  name="option"
                  label="Best Match"
                  value="match"
                  checked={selectedValue === "match"}
                />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSelect("count", "view_count")}
              >
                <Form.Check
                  type="radio"
                  name="option"
                  label="View Count"
                  value="count"
                  checked={selectedValue === "count"}
                />
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelect("new", "date")}>
                <Form.Check
                  type="radio"
                  name="option"
                  label="Newest"
                  value="new"
                  checked={selectedValue === "new"}
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
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
                        <div className="five-vid d-flex" key={index}>
                          {resource.avatar ? (
                            <div>
                              <img
                                src={`${API_URL.resource}/${resource.avatar}`}
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
                            <h5 className="my-1">{resource.topic}</h5>
                            <div className="flex items-center gap-2 mt-2 text-xs md:text-sm">
                              <p>By: {resource.author.username}</p>
                              <p>{resource.date}</p>
                            </div>
                            <div className="saves flex gap-3 items-center -mt-1">
                              {resource.rating <= 0 ? (
                                <p></p>
                              ) : (
                                <div className="-mt-[12px]">
                                  <Rating rating={resource.rating} />
                                </div>
                              )}
                              <div className="flex  gap-2 text-xs md:text-sm text-green-600 cursor-pointer">
                                <p>Viewed by</p>
                                <p>{resource.view_count}</p>
                              </div>
                              <div
                                className="flex  gap-2 text-xs md:text-sm text-green-600 cursor-pointer"
                                onClick={() => setCite(resource.citations)}
                              >
                                <p className="mt-1">
                                  <MdFormatQuote />
                                </p>
                                <p>Cite</p>
                              </div>
                              <div
                                className="flex gap-2 text-xs md:text-sm text-green-600 cursor-pointer"
                                onClick={() => setShows(true)}
                              >
                                <p className="mt-1">
                                  <BsShareFill />
                                </p>
                                <p>Share</p>
                              </div>
                            </div>
                            <p
                              className="text-xs md:text-sm hover:text-green-600 cursor-pointer text-gray-400"
                              onClick={() => getDetails(resource._id)}
                            >
                              View
                            </p>
                            <Modal
                              show={shows}
                              onHide={() => setShows(false)}
                              size="lg"
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Share this Resource</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p>Copy this URL to share:</p>
                                <input
                                  type="text"
                                  className="form-control mb-2"
                                  value={`${window.location.href}/resource_details?${resource._id}`}
                                  readOnly
                                />
                                <Button variant="primary" onClick={handleCopy}>
                                  {copied ? "Copied!" : "Copy"}
                                </Button>
                              </Modal.Body>
                            </Modal>
                            <Modal
                              show={showCitation}
                              onHide={() => setShowCitation(false)}
                              size="lg"
                              style={{ width: "100%" }}
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Citations</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {citationValues.length > 0 ? (
                                  <div className="flex gap-2 items-center">
                                    {citationValues.map((cite, index) => (
                                      <p key={index}>{cite}</p>
                                    ))}
                                  </div>
                                ) : (
                                  <p>No citations for this resource</p>
                                )}
                              </Modal.Body>
                            </Modal>
                          </div>
                        </div>

                        <br />
                        <div className="bl-line"></div>
                        <br />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    <p>No Resources with the name {resources}</p>
                  </div>
                )}
              </div>
              <div className="info--techss -mt-10">
                <div className="in4mation">
                  <h5>Explore Categories</h5>
                </div>
                <div className="top-buttons d-flex gap-3">
                  {allCat?.map((cat, index) => (
                    <div key={index}>
                      <button
                        className="tech__btn"
                        onClick={() => newSearch(cat.name.toLowerCase())}
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
                        onClick={() => newType(type.name.toLowerCase())}
                        className="cursor-pointer"
                      >
                        {type.name}
                      </h5>
                    ))}
                  </div>
                </div>
                <br />
              </div>
              <div className="in4mation">
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
              <div className="in4mation">
                <h5>Categories</h5>
              </div>
              <div className="top-buttons d-flex gap-3">
                {allCat.map((cat, index) => (
                  <div key={index}>
                    <button
                      className="tech__btn"
                      onClick={() => newSearch(cat.name.toLowerCase())}
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
                      onClick={() => newType(type.name.toLowerCase())}
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

export default LandingsearchResult;
