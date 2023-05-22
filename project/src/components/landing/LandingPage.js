import image from "../images/coatOfArm.png";
import image2 from "../images/world.png";
import { IoIosSearch } from "react-icons/io";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Landmobile from "./Landmobile";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoPrimitiveDot } from "react-icons/go";
import { SiBookstack } from "react-icons/si";
import API_URL from "../../Url";

function LandingPage() {
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
        const res = await axios.get(`${API_URL.resource}/categories/globe`);
        setStates({ loading: false, error: false });
        setAllCat(res.data);
      } catch (err) {
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
    const getTypes = async () => {
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
          errMsg: err.response.data.message,
        });
      }
    };
    getTypes();
  }, []);

  const getCat = (name) => {
    sessionStorage.setItem("cat", name);
    navigate(`/search_by_category?${name}`);
  };

  const getType = (name) => {
    sessionStorage.setItem("type", name);
    navigate(`/search_by_type?${name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchResource.length > 0) {
      navigate(`/resourceSearch?query=${searchResource}`);
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
        <div className="landing--cont d-flex mb-5 lg:mb-0">
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[0]?.name.toLowerCase())}
            >
              <h5>{allCat?.[0]?.name}</h5>
            </div>
            <p></p>
          </div>
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[1]?.name.toLowerCase())}
            >
              <h5>{allCat?.[1]?.name}</h5>
            </div>
            <p></p>
          </div>
        </div>
        <div className="landing--conttt xl:-mt-16 lg:-mt-2 ">
          <div className="map">
            <img src={image2} alt="" />
          </div>
        </div>
        <div className="landing--contt d-flex">
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[2]?.name.toLowerCase())}
            >
              <h5>{allCat?.[2]?.name}</h5>
            </div>
          </div>

          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[3]?.name.toLowerCase())}
            >
              <h5>{allCat?.[3]?.name}</h5>
            </div>
            <p></p>
          </div>
        </div>
        <div className="landing---contt d-flex xl:mb-10 xl:mt-10 lg:mb-4 lg:mt-4">
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[4]?.name.toLowerCase())}
            >
              <h5>{allCat?.[4]?.name}</h5>
            </div>
            <p></p>
          </div>

          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[5]?.name.toLowerCase())}
            >
              <h5>{allCat?.[5]?.name}</h5>
            </div>
            <p></p>
          </div>
        </div>
        <div className="landing---contt d-flex xl:mb-10 lg:mb-4 ">
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[6]?.name.toLowerCase())}
            >
              <h5>{allCat?.[6]?.name}</h5>
            </div>
            <p></p>
          </div>
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[7]?.name.toLowerCase())}
            >
              <h5>{allCat?.[7]?.name}</h5>
            </div>
          </div>
        </div>
        <div className="landing---conttt d-flex xl:mt-16  ">
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[8]?.name.toLowerCase())}
            >
              <h5>{allCat?.[8]?.name}</h5>
            </div>
          </div>
          <div className="ict">
            <div
              className="line cursor-pointer"
              onClick={() => getCat(allCat?.[9]?.name.toLowerCase())}
            >
              <h5>{allCat?.[9]?.name}</h5>
            </div>
          </div>
        </div>
        <br />
        <br />
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
      <div>
        <div className="md:flex hidden justify-center gap-20 flex-wrap px-10 relative">
          {types?.map((type, index) => (
            <div
              className="link text-[#198754] hover:text-gray-600 flex items-center gap-2 md:text-xl text-sm cursor-pointer"
              key={index}
              onClick={() => getType(type.name.toLowerCase())}
            >
              <p>
                <SiBookstack />
              </p>
              <p>{type.name}</p>
            </div>
          ))}
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
