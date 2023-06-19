import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import Ham from "./Ham";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import RequestModalR from "../admin/institutes/resources/RequestModalR";
import "../../pages/admin/resources/resource.css";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import API_URL from "../../Url";
import Rating from "../Rating";
import RatingInput from "../RatingInput";
import fileDownload from "js-file-download";
import { CgProfile } from "react-icons/cg";

function LandingsearchIndividualpage() {
  const [show, setShow] = useState(false);
  const [shows, setShows] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState();
  const [showReviews, setShowReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(false);
  const [msg, setMsg] = useState("");

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
        const res = await axios.get(
          `${API_URL.resource}/resources/one/${id}?public=true`
        );

        setResource(res.data);
      } catch (err) {}
    };
    getResources();
    const getRelated = async () => {
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/similar/${id}`
        );
        setRelated(res.data);
      } catch (err) {}
    };
    getRelated();
    const getReviews = async () => {
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/rating/${id}`
        );
        setReviews(res.data);
      } catch (err) {}
    };
    getReviews();
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

  const getProfile = () => {
    if (user) {
      navigate("/public/profile");
    } else {
      navigate("/login");
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating);
  };

  const handlePreviewClick = () => {
    setShowModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (review.length < 79 && review.length != 0) {
      setMsg("Review must not be less than 80 words");
      setSubmitMsg(true);
      return;
    }
    if (!selectedRating) {
      setMsg("You cannot post a review without rating");
      setSubmitMsg(true);
      return;
    }
    if (!user) {
      setMsg("login to post a review");
    }
    try {
      const res = await axios.post(
        `${API_URL.resource}/resources/rate/${id}`,
        {
          score: selectedRating,
          review: review,
        },
        {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        }
      );
      setMsg("success");
      setSubmitMsg(true);
    } catch (err) {
      console.log(err.response);
      if (err.response.status === 409) {
        setMsg("You already rated this resource");
        setSubmitMsg(true);
      }

      return;
    }
  };

  const handleClose = () => setShows(false);
  const handleShow = () => setShows(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const downloadBtn = async (file) => {
    if (user) {
      try {
        const res = await axios.get(
          `${API_URL.resource}/resources/download-file/${file._id}`,
          {
            headers: { Authorization: `Bearer ${user?.jwt_token}` },
            responseType: "blob",
          }
        );
        fileDownload(res.data, `${file.original_name}`);
      } catch (err) {}
    } else {
      alert("Sign Up or Login to download files");
    }
  };

  return (
    <div>
      <div className="LandingPgTwo overflow-hidden">
        <div className="landing-nav bg-light ">
          <div className="na_vv d-flex">
            <div className="hamburger--menu">
              <Ham />
            </div>
            <Link
              to="/"
              className="nav-bar d-flex mt-2 no-underline text-black hidden"
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
              {user && (
                <div className="profile p-1" onClick={() => getProfile()}>
                  <CgProfile />
                </div>
              )}
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
          <div className="grid gap-8 w-[100%] mx-auto mt-10">
            <div className="students d-flex ">
              <div className="guides">
                <h2>{resource.topic}</h2>
                <div>
                  <p className="flex gap-2 items-center ">
                    <span className="md:text-sm text-xs">By:</span>
                    <span className="md:text-sm text-xs">
                      {resource.author.username}
                    </span>
                  </p>
                  {resource.rating > 0 ? (
                    <div className="flex gap-2 items-center">
                      <Rating rating={resource.rating} />
                      <span className=" text-xs md:text-sm">
                        ({resource.number_of_ratings} ratings)
                      </span>
                    </div>
                  ) : (
                    <p className="-mt-2 mb-2">
                      <span className="md:text-sm text-xs">
                        {" "}
                        No ratings yet
                      </span>
                    </p>
                  )}
                  {resource.description && (
                    <div>
                      <h5>About</h5>
                      <div>
                        <p
                          className={
                            "show_details " + (showDetails && "active")
                          }
                          dangerouslySetInnerHTML={{
                            __html: resource.description,
                          }}
                        ></p>
                        <p
                          className="text-[15px] text-green-600 cursor-pointer underline"
                          onClick={() => handlePreviewClick()}
                        >
                          Read More
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap items-start w-full my-2">
                    <p className="flex gap-2 items-center">
                      <span className="md:text-sm text-xs">Institute:</span>
                      <span className="md:text-sm text-xs">
                        {resource.institute.name}
                      </span>
                    </p>

                    <p className="flex gap-2 items-center">
                      <span className="md:text-sm text-xs"> Category:</span>

                      <span className="md:text-sm text-xs">
                        {resource.category}
                      </span>
                    </p>

                    <p className="flex gap-2 items-center">
                      <span className="md:text-sm text-xs">Resource type:</span>

                      <span className="md:text-sm text-xs">
                        {resource.resource_type}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <p className="flex gap-2 items-center my-2">
                      <span className="md:text-sm text-xs">
                        Sub-categories:
                      </span>
                      {resource.sub_categories.map((sub, index) => (
                        <span key={index} className="text-xs md:text-sm">
                          {sub}
                        </span>
                      ))}
                    </p>
                    <p className="flex gap-2 items-center my-2 ">
                      <span className="md:text-sm text-xs">Citations:</span>
                      {resource.citations.map((cit, index) => (
                        <span key={index} className="text-xs md:text-sm">
                          {cit}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0 w-full">
                    <h1 className="my-2 text-lg md:text-xl lg:text-2xl">
                      Files
                    </h1>
                    {resource?.files?.length ? (
                      <table className="bg-white rounded-md shadow-md">
                        <thead>
                          <tr>
                            <th scope="col">s/n</th>
                            <th scope="col">Files</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resource.files.map((file, index) => (
                            <tr key={index}>
                              <td data-label="s/n">{index + 1}</td>
                              <td data-label="files">{file.original_name}</td>
                              <td>
                                <div className="flex gap-3 items-center">
                                  <button
                                    className="btn_green"
                                    onClick={() => downloadBtn(file)}
                                  >
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div>
                        <p>No files found</p>
                      </div>
                    )}
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
                    <button className="stu-btn" onClick={() => handleShow()}>
                      Share
                    </button>
                  </div>
                  <div>
                    <button
                      className="stu-btnn"
                      onClick={() => handlePreviewClick()}
                    >
                      Read preview
                    </button>
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
                  <button className="stu-btn" onClick={() => handleShow()}>
                    Share
                  </button>
                </div>
                <div>
                  <button
                    className="stu-btnn"
                    onClick={() => handlePreviewClick()}
                  >
                    Read preview
                  </button>
                </div>
              </div>
            </div>
            <br />
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              size="lg"
              style={{ width: "100%" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>About</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p
                  dangerouslySetInnerHTML={{
                    __html: resource.description,
                  }}
                ></p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={submitMsg}
              onHide={() => setSubmitMsg(false)}
              size="xl"
              style={{ width: "100%" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>{msg}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setSubmitMsg(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={shows} onHide={() => handleClose()} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Share this Resource</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Copy this URL to share:</p>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={window.location.href}
                  readOnly
                />
                <Button variant="primary" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Modal.Body>
            </Modal>
            <div
              className="horizontal-line"
              style={{ width: "90%", margin: "auto" }}
            ></div>
            <br />

            <div>
              {related?.length ? (
                <div className="container  related">
                  <h5>Related to {resource.topic}</h5>
                  <div className="flex  gap-5 overflow-x-auto w-full">
                    {related?.map((resource, index) => (
                      <div key={index}>
                        <div>
                          {resource.avatar ? (
                            <div>
                              <img
                                src={`${API_URL.resource}/${resource.avatar}`}
                                alt="avatar resource"
                                className="object-contain h-[200px] w-[200px]"
                              />
                            </div>
                          ) : (
                            <div>
                              <img
                                src="/default.png"
                                alt="default"
                                className="object-cover h-[200px] min-w-[250px]"
                              />
                            </div>
                          )}

                          <span className="pub">{resource.topic}</span>
                          {/* <h5>{resource.author.username}</h5> */}
                          {resource.rating > 0 && (
                            <div className="flex gap-2  items-center ">
                              <Rating rating={resource.rating} />
                              <span className=" text-xs md:text-sm">
                                ( {resource.number_of_ratings} ratings)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            <div className="flex flex-col gap-3 w-[87%] mx-auto">
              <h5>Review for {resource.topic}</h5>
              {resource.rating > 0 && (
                <div className="flex gap-2 items-center ">
                  <Rating rating={resource.rating} />
                  <span className=" text-xs md:text-sm">
                    ( {resource.number_of_ratings} ratings)
                  </span>
                </div>
              )}
              <div className="flex gap-2 items-center text-sm">
                {resource.number_of_ratings ? (
                  <p>{resource.number_of_ratings} rating</p>
                ) : (
                  <p></p>
                )}
                {reviews?.length ? <p>{reviews.length} review</p> : <p></p>}
              </div>
              {reviews ? (
                <div className={"show_reviews " + (showReviews && "active")}>
                  <button
                    className="btn_green w-fit bg-slate-300"
                    onClick={() => setShowReviews(!showReviews)}
                  >
                    Show Reviews
                  </button>
                  <button
                    className="btn_green w-fit bg-slate-300"
                    onClick={() => setShowReviews(!showReviews)}
                  >
                    Hide Reviews
                  </button>
                  <div className="reviews my-2">
                    {reviews?.map((review, index) => (
                      <div className="flex flex-col gap-1" key={index}>
                        <div className="flex gap-3 items-center text-sm">
                          <p>{review.author.username}</p>
                          <div className="-mt-3">
                            <Rating rating={review.score} />
                          </div>
                        </div>
                        <p>{review.review}</p>
                        <div className="h-[1px] w-full bg-slate-300 -mt-3 mb-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex flex-col gap-3 bg-slate-100 md:p-6 p-3">
                <div className="flex flex-col gap-2">
                  <h5 className="md:text-2xl text-md ">What do you think</h5>
                  <div className="flex gap-4 items-center">
                    <RatingInput
                      maxStars={5}
                      onRatingChange={handleRatingChange}
                    />
                    {/* <button
                      className="btn_green w-fit"
                      onClick={handleSubmitRating}
                    >
                      Rate
                    </button> */}
                  </div>
                </div>
                <form className="flex flex-col gap-2">
                  <h5 className="md:text-2xl text-md ">Write a Review</h5>
                  <p className="md:text-base text-sm -mt-2 ">
                    Review must be at least 80 words
                  </p>
                  <div className="w-full bg-white flex flex-col gap-4 p-3 ">
                    <textarea
                      className="bg-transparent outline-none"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <button
                      className="btn_green w-fit self-end"
                      onClick={(e) => submitReview(e)}
                    >
                      Submit
                    </button>
                  </div>
                </form>
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
