import React from "react";
import image from "../images/logo-2.png";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import image2 from "../images/globe.png";

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
      } catch (err) {
        setStates({
          loading: false,
          error: true,
          errMsg: 
             err?.response?.data?.errors[0]?.msg
            || err?.response?.data?.message,
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
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err?.response?.data?.message,
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

  const getCat = (name) => {
    sessionStorage.setItem("cat", name);
    navigate(`/search_by_category?${name}`);
  };
  return (
    <div>
      <div className="Landmobile">
        <div className="landmb d-flex">
          <div className="lndmb-imagew-[100px] h-[100px]">
            <img src={image} alt="" className="w-full h-full" />
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
        <div className="yelp">
          <div className="yepp mb-5">
            <img src={image2} alt="" />
          </div>
        </div>
        <br />
        <div className="flex flex-col gap-3 -mt-4 ">
          <h5 className="text-center text-[20px] text-gray-600">
            Browse Research Materials by: Types
          </h5>
          <div className="flex gap-3 flex-wrap mx-auto justify-center">
            {types?.map((type, index) => (
              <div
                className="text-[15px] text-[#198754] cursor-pointer"
                onClick={() => getType(type)}
                key={index}
              >
                <h5 className="text-[15px]">{type.name}</h5>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <br />
        <div className="flex flex-col gap-3 -mt-4 ">
          <h1 className="text-center text-[20px]  text-gray-600">
            Browse Research Materials by: Categories
          </h1>

          <div className="flex gap-3 flex-wrap mx-auto justify-center">
            {allCat.map((cat, index) => (
              <div
                className="cursor-pointer"
                onClick={() => getCat(cat.name)}
                key={index}
              >
                <h5 className="text-[15px] text-[#198754]">{cat.name}</h5>
                {cat &&
                  (cat.resource > 0 ? (
                    <p className="text-[10px] -mt-1">
                      {cat.resource}+ Articles
                    </p>
                  ) : (
                    <p className="text-[10px] -mt-1">No Articles</p>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landmobile;
