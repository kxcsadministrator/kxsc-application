import React from "react";
import image from "../images/coatOfArm.png";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import image2 from "../images/worldmap.png";
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

function Landmobile() {
  const [allCat, setAllCat] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });

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
  return (
    <div>
      <div className="Landmobile">
        <div className="landmb d-flex">
          <div className="lndmb-image">
            <img src={image} alt="" />
          </div>
          <div className="lndmbtext">
            <h5>Knowledge Exchange</h5>
            <p>The Data Knowledge driven Platform</p>
          </div>
        </div>
        <div className="inpu_tt p-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              aria-label="Dollar amount (with dot and two decimal places)"
              placeholder="Search skills, subjects or software"
            />
            <Link to={"/landingsearch"}>
              <span className="in-search bg-primary input-group-text text-white">
                <div className="fasearch text-white">
                  <IoIosSearch />
                </div>
              </span>
            </Link>
          </div>
        </div>
        <br />
        <hr />
        <div className="yelp">
          <div className="yepp mb-5">
            <img src={image2} alt="" />
          </div>
          <div className="lo-rem">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ipsam,
              sapiente, neque nihil tempore a fuga adipisci quae, placeat
              eveniet nulla libero quasi? Ullam, hic mollitia! Explicabo cum
              esse culpa.
            </p>
          </div>
        </div>
        <br />
        <div>
          <div className="containerx text-center">
            <div className="row">
              {/* <div className="col">
                <Link to={"/categorysinglepage"}>
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className="fnt"
                    style={{ color: "red", fontSize: "25px" }}
                  ></FontAwesomeIcon>
                  Commons
                </Link>
              </div>
              <div className="col">
                <FontAwesomeIcon
                  icon={faPlaneArrival}
                  className="fnt"
                  style={{ color: "", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Wikivoyage
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="containerx text-center">
            <div className="row">
              <div className="col">
                <FontAwesomeIcon
                  icon={faBook}
                  className="fnt"
                  style={{ color: "blue", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Wikitionary
              </div>
              <div className="col">
                <div className="col">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="fnt"
                    style={{ color: "black", fontSize: "25px" }}
                  ></FontAwesomeIcon>
                  Wikiquote
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="containerx text-center">
            <div className="row">
              <div className="col">
                <FontAwesomeIcon
                  icon={faNewspaper}
                  className="fnt"
                  style={{ color: "grey", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Wikinews
              </div>
              <div class="col">
                <FontAwesomeIcon
                  icon={faMobile}
                  className="fnt"
                  style={{ color: "purple", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Wikidata
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="containerx text-center">
            <div class="row">
              <div class="col">
                <FontAwesomeIcon
                  icon={faFileWord}
                  className="fnt"
                  style={{ color: "green", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Wikibook
              </div>
              <div class="col">
                <FontAwesomeIcon
                  icon={faNoteSticky}
                  className="fnt"
                  style={{ color: "blue", fontSize: "25px" }}
                ></FontAwesomeIcon>
                Mediawiki
              </div> */}
            </div>
          </div>
        </div>

        <i
          className="fab fa-adn"
          style={{ fontSize: "48px", color: "red" }}
        ></i>
      </div>
    </div>
  );
}

export default Landmobile;
