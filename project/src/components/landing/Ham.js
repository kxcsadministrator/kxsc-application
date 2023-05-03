import React, { useState, useEffect } from "react";
import image6 from "../images/kxcc.png";
import image9 from "../images/google-removebg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Ham() {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [allCat, setAllCat] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const navigate = useNavigate();

  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked");
      setMenuClass("menu visible ");
    } else {
      setBurgerClass("burger-bar unclicked");
      setMenuClass("burger hidden");
    }
    setIsMenuClicked(!isMenuClicked);
  };

  //get categories
  useEffect(() => {
    const getCategories = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`http://15.188.62.53:3002/categories/all`);
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
    navigate(`/search_by_category?${name}`);
  };

  return (
    <div>
      <div className="men-u">
        <div className="men_u">
          <nav>
            <div className="burger_menu" onClick={updateMenu}>
              <div className={burger_class}></div>
              <div className={burger_class}></div>
              <div className={burger_class}></div>
            </div>
          </nav>
        </div>
        <div className={menu_class}>
          <div className="hamburger">
            <div className="ham-burger d-flex gap-2">
              <img src={image6} alt="" />
              <div className="ham-txt">
                <h5>Knowledge Exchange</h5>
              </div>
            </div>
            <br />
            <hr />
            <div>
              <div className="brow-se">
                <h5>Browse by</h5>
                <div className="brwse d-flex">
                  <div>
                    {allCat.map((cat, index) => (
                      <h5
                        key={index}
                        onClick={() => getCat(cat.name)}
                        className="cursor-pointer"
                      >
                        {cat.name}
                      </h5>
                    ))}
                  </div>
                </div>
              </div>
              <br />
              <hr />
              <div className="intss">
                <h5>Downlod our app to read books on any device </h5>

                <img src={image9} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ham;
