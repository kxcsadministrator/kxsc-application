import React, { useState } from "react";
import image from "../images/macdonald1.jpg";
import image3 from "../images/about.jpg";
import image4 from "../images/background.jpg";
import image7 from "../images/numbers.webp";
import image5 from "../images/certificate.jpg";
import image6 from "../images/kxcc.png";
import image8 from "../images/beach.webp";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ModalOne from "./ModalOne";
import Ham from "./Ham";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function LandingsearchIndividualpage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div className="LandingPgTwo">
        <div className="landing-nav bg-light ">
          <div className="na_vv d-flex">
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
        <div className="cont-tainer">
          <div className="container text-center p-3">
            <div class="row">
              <div class="col">What is Scribd?</div>
              <div class="col">Ebooks</div>
              <div class="col">Audiobooks</div>
              <div class="col">Magazine</div>
              <div class="col">Podcasts</div>
              <div class="col">Sheet music</div>
              <div class="col">Documents</div>
              <div class="col">Snapshots</div>
            </div>
          </div>
        </div>
        <div className="landing-bk">
          <div className="landing_display d-flex">
            <div className="landing_endless p-4">
              <h5>
                Endless entertainment
                <br /> and knowledge at your fingertips
              </h5>
              <button type="button" class="btn btn-dark">
                Sign up for free
              </button>
              <p>
                <span className="sp text-success">
                  To get access from anywhere at anytime
                </span>
              </p>
            </div>
            <div className="landing-image">
              <img src={image} alt="" />
            </div>
          </div>

          <div className="mobileviewss">
            <div className="mobbs">
              <h5>
                Endless entertainment
                <br /> and knowledge at your fingertips
              </h5>
              <button type="button" class="btn btn-dark">
                Sign up for free
              </button>
              <p>
                <span className="sp text-success">
                  To get access from anywhere at anytime
                </span>
              </p>
            </div>
            <div>
              <img src={image} alt="" />
            </div>
          </div>
          <br />
        </div>
        <div className="scroll-section">
          <div className="appp d-flex">
            <div>
              <img src={image8} alt="" />
            </div>
            <div>
              <img src={image8} alt="" />
            </div>
            <div>
              <img src={image8} alt="" />
            </div>
            <div>
              <img src={image8} alt="" />
            </div>
          </div>
        </div>
        <br />
        <div className="students d-flex">
          <div className="guides">
            <h2>
              Students' Guide to Information
              <br /> Technology
            </h2>
            <div>
              <h5>About this resources</h5>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
                perspiciatis
                <br /> reprehenderit quam voluptate assumenda unde, nam
                consequatur
                <br /> quibusdam nihil? Maxime eaque atque sequi odit at eum ad
                repellendus aliquam qui.
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
                perspiciatis
                <br /> reprehenderit quam voluptate assumenda unde, nam
                consequatur
                <br /> quibusdam nihil? Maxime eaque atque sequi odit at eum ad
                repellendus aliquam qui.
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
                perspiciatis
                <br /> reprehenderit quam voluptate assumenda unde, nam
                consequatur
                <br /> quibusdam nihil? Maxime eaque atque sequi odit at eum ad
                repellendus aliquam qui.
              </p>
            </div>
            <div className="stu-imagez">
              <img src={image7} alt="" />
              <div>
                <button className="stu-btn">Start your free 30 days</button>
              </div>
              <div>
                <button className="stu-btnn">Read preview</button>
              </div>
            </div>
          </div>
          <div className="stu-image">
            <img src={image7} alt="" />
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
        <br />

        <Footer />
      </div>
    </div>
  );
}

export default LandingsearchIndividualpage;
