import image from "../images/logo-2.png";
import image2 from "../images/globe.png";
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
        console.log(res.data);
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
          <div className="land---image w-[130px] h-[130px]">
            <img src={image} alt="" className="w-full h-full" />
          </div>
          <div className="landing-text">
            <h3>Knowledge Exchange</h3>
            <p>The Data Knowledge Driven Platform</p>
          </div>
          <br />
        </div>
        <div className="globe">
          <div className="globe_item">
            <div className="landing--cont">
              <div className="ict">
                <div
                  className="line cursor-pointer capitalize"
                  onClick={() => getCat(allCat?.[0]?.name)}
                >
                  <h5 className="text-right">{allCat?.[0]?.name}</h5>
                  {allCat?.[0] &&
                    (allCat?.[0].resources > 0 ? (
                      <p className="text-right text-sm">
                        {allCat?.[0]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-right text-sm">No Articles</p>
                    ))}
                </div>
              </div>
              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[3]?.name)}
                >
                  <h5 className="text-right">{allCat?.[3]?.name}</h5>
                  {allCat?.[3] &&
                    (allCat?.[3].resource > 0 ? (
                      <p className="text-right text-sm">
                        {allCat?.[3]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-right text-sm">No Articles</p>
                    ))}
                </div>
              </div>

              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[5]?.name)}
                >
                  <h5 className="text-right">{allCat?.[5]?.name}</h5>
                  {allCat?.[5] &&
                    (allCat?.[5].resources > 0 ? (
                      <p className="text-right text-sm">
                        {allCat?.[5]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-right text-sm">No Articles</p>
                    ))}
                </div>
              </div>

              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[7]?.name)}
                >
                  <h5 className="">{allCat?.[7]?.name}</h5>
                  {allCat?.[7] &&
                    (allCat?.[7].resources > 0 ? (
                      <p className="text-right text-sm">
                        {allCat?.[7]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-right text-sm">No Articles</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="globe_item_center">
            <div className=".landing--conttt">
              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[1]?.name)}
                >
                  <h5>{allCat?.[1]?.name}</h5>
                  {allCat?.[1] &&
                    (allCat?.[1].resources > 0 ? (
                      <p className="text-sm">
                        {allCat?.[1]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-sm">No Articles</p>
                    ))}
                </div>
              </div>
              <div className="landing--conttt">
                <div className="map my-4">
                  <img src={image2} alt="" />
                </div>
              </div>
              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[8]?.name)}
                >
                  <h5>{allCat?.[8]?.name}</h5>
                  {allCat?.[8] &&
                    (allCat?.[8].resources > 0 ? (
                      <p className="text-sm">
                        {allCat?.[8]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-sm">No Articles</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="globe_item_right">
            <div className="landing--cont">
              <div className="ict">
                <div
                  className="line cursor-pointer capitalize"
                  onClick={() => getCat(allCat?.[2]?.name)}
                >
                  <h5 className="text-left">{allCat?.[2]?.name}</h5>
                  {allCat?.[2] &&
                    (allCat?.[2].resources > 0 ? (
                      <p className="text-left text-sm">
                        {allCat?.[2]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-left text-sm">No Articles</p>
                    ))}
                </div>
              </div>
              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[4]?.name)}
                >
                  <h5 className="text-left">{allCat?.[4]?.name}</h5>
                  {allCat?.[4] &&
                    (allCat?.[4].resources > 0 ? (
                      <p className="text-left text-sm">
                        {allCat?.[4]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-left text-sm">No Articles</p>
                    ))}
                </div>
              </div>

              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[6]?.name)}
                >
                  <h5 className="text-left">{allCat?.[6]?.name}</h5>
                  {allCat?.[6] &&
                    (allCat?.[6].resources > 0 ? (
                      <p className="text-left text-sm">
                        {allCat?.[6]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-left text-sm">No Articles</p>
                    ))}
                </div>
              </div>

              <div className="ict">
                <div
                  className="line cursor-pointer"
                  onClick={() => getCat(allCat?.[9]?.name)}
                >
                  <h5 className="text-left">{allCat?.[9]?.name}</h5>
                  {allCat?.[9] &&
                    (allCat?.[9].resources > 0 ? (
                      <p className="text-left text-sm">
                        {allCat?.[9]?.resources}+ Articles
                      </p>
                    ) : (
                      <p className="text-left text-sm">No Articles</p>
                    ))}
                </div>
              </div>
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
              onClick={() => getType(type.name)}
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
