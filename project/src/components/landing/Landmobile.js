import React from "react";
import image from "../images/coatOfArm.png";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import image2 from "../images/worldmap.png";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Url";
import { SiBookstack } from "react-icons/si";

function Landmobile() {
  const [allCat, setAllCat] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [searchResource, setSearchResource] = useState("");
  const [errText, setErrText] = useState("");
  const [types, setTypes] = useState();
  const navigate = useNavigate();

  //get categories
  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchResource.length > 0) {
      navigate(`/resourceSearch?query=${searchResource}`);
      sessionStorage.setItem("search", searchResource);
    } else {
      setErrText("Input field is empty");
    }
  };

  const getType = (name) => {
    sessionStorage.setItem("type", name);
    navigate(`/search_by_type?${name}`);
  };
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
        <div className="w-[90%] mx-auto">
          <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
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
        <hr />
        <div className="yelp">
          <div className="yepp mb-5">
            <img src={image2} alt="" />
          </div>
        </div>
        <br />
        {/* {types?.map((type, index) => (
          <div className="d-flex" key={index}>
            <div
              className="link text-gray-800 hover:text-gray-300 flex items-center gap-1 text-sm cursor-pointer w-full"
              onClick={() => getType(type.name.toLowerCase())}
            >
              <p>
                <SiBookstack />
              </p>
              <p>{type.name}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default Landmobile;
