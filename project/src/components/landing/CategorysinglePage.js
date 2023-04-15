import React, { useState } from "react";
import image6 from "../images/kxcc.png";
import image from "../images/beach.webp";
import { IoIosSearch } from "react-icons/io";
import ModalOne from "./ModalOne";
import Ham from "./Ham";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { AiOutlineStar } from "react-icons/ai";
import { AiOutlineShareAlt } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

function CategorysinglePage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div className="PageFour">
        <div
          className="landing-nav bg-light mb-2"
          style={{ position: "sticky", top: "0" }}
        >
          <div className="navv-vv d-flex">
            <div className="hamburger--menu">
              <Ham />
            </div>
            <div className="nav-bar d-flex mt-2">
              <Link to={"/"}>
                <div className="link-image">
                  <img src={image6} alt="" />
                </div>
              </Link>
              <div className="nav-txt">
                <h5>Knowledge Exchange</h5>
              </div>
            </div>
            <div className="inputt p-2">
              <div className="input-group">
                <span className="in-search bg-light input-group-text">
                  Learning
                </span>
                <input
                  type="text"
                  className="form-control"
                  aria-label="Dollar amount (with dot and two decimal places)"
                  placeholder="Search skills, subjects or software"
                />
                <span className="in-search bg-light input-group-text">
                  <IoIosSearch />
                </span>
              </div>
            </div>
            <div className="sg d-flex  p-2">
              <div className="profile p-1">
                <CgProfile />
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <ModalOne />
                </Modal.Body>
              </Modal>

              <button
                type="button"
                class="btn btn-primary"
                onClick={handleShow}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
        <div className="inputtt p-2">
          <div className="input-group">
            <span className="in-search bg-light input-group-text">
              Learning
            </span>
            <input
              type="text"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              placeholder="Search skills, subjects or software"
            />
            <span className="in-search bg-light input-group-text">
              <IoIosSearch />
            </span>
          </div>
        </div>
        <div className="main-dropdown">
          <div className="nav_under d-flex">
            <div>
              <h5 className="nav--underText text-primary">Home /</h5>
            </div>

            <div>
              <h5 className="nav--underText text-primary">All topics /</h5>
            </div>

            <Link to={"/cateLanding"}>
              <div>
                <h5 className="nav--underText text-primary">
                  Information Technology
                </h5>
              </div>
            </Link>
          </div>
          <br />
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
          <br />
          <br />
          <br />
          <div className="four-color bg-light">
            <div className="sub-navbar d-flex gap-3 pt-3">
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
          <div className="explore">
            <div className="tp d-flex">
              <div className="intech">
                <h5>Information Technology</h5>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Blanditiis voluptates aut quidem tempore praesentium ducimus
                  <br /> iusto, quasi asperiores amet deserunt, quisquam rerum!
                  Nulla animi porro voluptas odio natus ea ex?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Blanditiis voluptates aut quidem tempore praesentium ducimus
                  <br /> iusto, quasi asperiores amet deserunt, quisquam rerum!
                  Nulla animi porro voluptas odio natus ea ex?
                </p>
              </div>

              <div className="tech">
                <h5>Explore Technology Topics</h5>

                <div className="bbtn">
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Cloud Computing</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Data Science</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Database Management</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">DevOps</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">IT Help Desk</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Mobile Development</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">
                      Network and System Administration
                    </button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Security</button>
                  </div>
                  <div className="tech-categories mb-2">
                    <button className="sec-btn">Software Development</button>
                  </div>
                  <div>
                    <button className="sec-btn">Web Development</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vid-eo">
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <Link to={"/individualPage"} className="line">
                <h5>Introduction to Architecture</h5>
              </Link>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>

          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>
          <br />
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <h5>Introduction to Architecture</h5>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>
          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>
          <br />
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <h5>Introduction to Architecture</h5>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>
          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>
          <br />
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <h5>Introduction to Architecture</h5>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>
          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>
          <br />
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <h5>Introduction to Architecture</h5>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>
          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>
          <br />
          <div className="five-vid d-flex">
            <div className="fvv-image">
              <img src={image} alt="" />
            </div>
            <div className="fv-vid p-3">
              <span>Course</span>
              <h5>Introduction to Architecture</h5>
              <p>By: Ed Liberman</p>
              <h3 className="dates">11,121 views Released Dec 14, 2023</h3>
              <div className="saves d-flex gap-3">
                <button className="sa_ve-btn">
                  <AiOutlineStar />
                  Save
                </button>
                <div className="viewers">Viewed By 1000</div>
                <button className="sa_ve-btn">
                  <AiOutlineShareAlt />
                  Share Time
                </button>
              </div>
            </div>
          </div>
          <div className="mobile___dropdown">
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
          </div>
          <br />
          <div className="bl"></div>

          <div className="scroll-section">
            <div className="appp d-flex">
              <div>
                <img src={image} alt="" />
              </div>
              <div>
                <img src={image} alt="" />
              </div>
              <div>
                <img src={image} alt="" />
              </div>
              <div>
                <img src={image} alt="" />
              </div>
            </div>
          </div>

          <div className="bbtn_n">
            <h5>Explore Technology Topics</h5>

            <div className="tech-categories mb-2">
              <button className="sec-btn">Cloud Computing</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">Data Science</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">Database Management</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">DevOps</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">IT Help Desk</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">Mobile Development</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">
                Network and System Administration
              </button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">Security</button>
            </div>
            <div className="tech-categories mb-2">
              <button className="sec-btn">Software Development</button>
            </div>
            <div>
              <button className="sec-btn">Web Development</button>
            </div>
          </div>
        </div>

        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default CategorysinglePage;
