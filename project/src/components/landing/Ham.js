import React, { useState } from "react";
import image6 from "../images/kxcc.png";
import image9 from "../images/google-removebg.png";

function Ham() {
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  const [menu_class, setMenuClass] = useState("menu hidden");
  const [isMenuClicked, setIsMenuClicked] = useState(false);

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
                    <div>
                      <h5>Books</h5>
                    </div>
                    <div>
                      <h5>Magazines</h5>
                    </div>
                    <div>
                      <h5>Documents</h5>
                    </div>
                  </div>
                </div>
                <br />
                <h5>Interests</h5>
                <div className="ints">
                  <h5>Career & Growth</h5>
                  <h5>Business</h5>
                  <h5>Finance & Money Management</h5>
                  <h5>Politics</h5>
                  <h5>Sports & Recreation</h5>
                  <h5>Games & Activities</h5>
                  <h5>Social Science</h5>
                  <h5>True Crime</h5>
                  <h5>Travel</h5>
                  <h5>Comic & Graphic Novels</h5>
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
