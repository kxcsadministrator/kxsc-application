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

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [allCat, setAllCat] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [searchResource, setSearchResource] = useState("");
  const [errText, setErrText] = useState("");
  const navigate = useNavigate();

  //get categories
  useEffect(() => {
    const getCategories = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`http://15.186.62.53:3002/categories/all`);
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
  }, []);

  const getCat = (name) => {
    sessionStorage.setItem("cat", name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchResource.length > 0) {
      navigate("/landingsearch");
      sessionStorage.setItem("search", searchResource);
    } else {
      setErrText("Input field is empty");
    }
  };

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
        <form className="input" onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              placeholder="Search skills, publication or research"
              value={searchResource}
              onChange={(e) => setSearchResource(e.target.value)}
            />
            <span className="in-search bg-success input-group-text">
              <button className="fasearch text-white" type="submit">
                <IoIosSearch />
              </button>
            </span>
          </div>
          <p className="text-red-500 text-sm my-2">{errText}</p>
        </form>
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
            {/* <div className="col">
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
            </div> */}
            {allCat.map((cat, index) => (
              <div className="col">
                <Link
                  to="/landing"
                  className="link text-gray-500 hover:text-green_bg"
                  onClick={() => getCat(cat.name)}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
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
