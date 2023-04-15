import React from "react";
import image from "../images/coatOfArm.png";
import image2 from "../images/world.png";
import { IoIosSearch } from "react-icons/io";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Landmobile from "./Landmobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBook,
  faFileWord,
  faNewspaper,
  faQuoteLeft,
  faPlaneArrival,
  faNoteSticky,
  faMobile,
} from "@fortawesome/free-solid-svg-icons";

function LandingPage() {
  return (
    <div>
      <div className="landing-home">
        <div className="landing--home">
          <div className="land---image">
            <img src={image} alt="" />
          </div>
          <div className="landing-text">
            <h3>Knowledge Exchange</h3>
            <p>The Data Knowledge Driven Platform</p>
          </div>
          <br />
        </div>
        <div className="landing--cont d-flex">
          <div className="ict">
            <Link to={"/categorysinglepage"} className="line">
              <h5>ICT </h5>
            </Link>
            <p>200/478+ articles</p>
          </div>
          <div className="ict">
            <h5>Production</h5>
            <p>200/478+ articles</p>
          </div>
        </div>
        <div className="landing--conttt">
          <div className="map">
            <img src={image2} alt="" />
          </div>
        </div>
        <div className="landing--contt d-flex">
          <div className="ict">
            <h5>Science & Technology </h5>
            <p>200/478+ articles</p>
          </div>
          <div></div>
          <div className="ict">
            <h5>Mechanize Agriculture</h5>
            <p>200/478+ articles</p>
          </div>
        </div>
        <div className="landing---contt d-flex">
          <div className="ict">
            <h5>Nano Technologies </h5>
            <p>200/478+ articles</p>
          </div>
          <div></div>
          <div className="ict">
            <h5>Safety & Security</h5>
            <p>200/478+ articles</p>
          </div>
        </div>
        <div className="landing---contt d-flex">
          <div className="ict">
            <h5>Blockchain </h5>
            <p>200/478+ articles</p>
          </div>
          <div></div>
          <div className="ict">
            <h5>Robotics</h5>
            <p>200/478+ articles</p>
          </div>
        </div>
        <div className="landing---conttt d-flex">
          <div className="ict">
            <h5>Fintech </h5>
            <p>200/478+ articles</p>
          </div>
          <div className="ict">
            <h5>AI</h5>
            <p>200/478+ articles</p>
          </div>
        </div>
        <br />
        <div className="input">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              placeholder="Search skills, publication or research"
            />
            <Link to={"/landingsearch"}>
              <span className="in-search bg-success input-group-text">
                <div className="fasearch text-white">
                  <IoIosSearch />
                </div>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="border-line"></div>
      <br />
      <div className="browse text-success">
        <h5>Browse by:</h5>
      </div>
      <br />
      <br />
      <div>
        <div className="container text-center">
          <div className="row">
            <div className="col">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="fnt"
                style={{ color: "red", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Commons
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faPlaneArrival}
                className="fnt"
                style={{ color: "", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikivoyage
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faBook}
                className="fnt"
                style={{ color: "blue", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikitionary
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faQuoteLeft}
                className="fnt"
                style={{ color: "black", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikiquote
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="container text-center">
          <div className="row">
            <div className="col">
              <FontAwesomeIcon
                icon={faNewspaper}
                className="fnt"
                style={{ color: "grey", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikinews
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faMobile}
                className="fnt"
                style={{ color: "purple", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikidata
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faFileWord}
                className="fnt"
                style={{ color: "green", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Wikibook
            </div>
            <div className="col">
              <FontAwesomeIcon
                icon={faNoteSticky}
                className="fnt"
                style={{ color: "blue", fontSize: "35px" }}
              ></FontAwesomeIcon>
              Mediawiki
            </div>
          </div>
        </div>
        <div className="land---mobile">
          <Landmobile />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
