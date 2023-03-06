import React from "react";
import { FiUsers } from "react-icons/fi";
import { useContext } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoIosNotificationsOutline } from "react-icons/io";
import { HiArrowSmDown } from "react-icons/hi";
import { HiArrowSmUp } from "react-icons/hi";
import Compo from "./Compo";

import { Context } from "../context/Context";

// import image from './image/user2.jpg';

function Panel() {
  const { user } = useContext(Context);
  return (
    <div>
      <div className="panel">
        <div className="rr">
          <Compo />
        </div>
        <div className="main--side">
          <div className="main-side">
            <div className="main---side d-flex">
              <div>
                <IoIosSearch />
              </div>
              <div className="panel-icons d-flex ">
                {user.profile_picture ? (
                  <div>
                    <img src={user.profile_picture} alt="profile_picture" />
                  </div>
                ) : (
                  <div>
                    <FiUsers />
                  </div>
                )}

                <div>
                  <IoIosNotificationsOutline />
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <div className="row">
              <div className="col">
                <div className="cardOne d-flex">
                  <div>
                    <h5>BUDGET</h5>
                    <h4>$24k</h4>
                    <div className="card-arr d-flex gap-2">
                      <div>
                        <HiArrowSmDown />
                        <span>12%</span>
                      </div>
                      <div className="card-txt">
                        <span className="txt-corl text-black">
                          Since last month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-color"></div>
                </div>
              </div>
              <div className="col">
                <div className="cardOne d-flex">
                  <div>
                    <h5>TOTAL CUSTOMER</h5>
                    <h4>$1,6k</h4>
                    <div className="card-arr d-flex gap-2">
                      <div>
                        <HiArrowSmUp />
                        <span>16%</span>
                      </div>
                      <div className="card-txt">
                        <span className="txt-corl text-black">
                          Since last month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-colorTwo"></div>
                </div>
              </div>
              <div className="col">
                <div className="cardOne d-flex">
                  <div>
                    <h5>TASK PROGRESS</h5>
                    <h4>75.5%</h4>
                  </div>
                  <div className="card-colorThr"></div>
                </div>
              </div>
              <div className="col">
                <div className="cardOne d-flex">
                  <div>
                    <h5>TOTAL PROFIT</h5>
                    <h4>$23k</h4>
                    <div className="card-arr d-flex gap-2"></div>
                  </div>
                  <div className="card-colorFr"></div>
                </div>
              </div>
            </div>
            <br />
            <div>
              <div class="row">
                <div class="col-sm-8">
                  <div className="tabsOne">
                    <div className="containers">
                      <div className="bar one"></div>
                      <div className="bar two"></div>
                      <div className="bar three"></div>
                      <div className="bar four"></div>
                      <div className="bar five"></div>
                      <div className="bar six"></div>

                      <ul className="v-meter">
                        <li>
                          <div>50m</div>
                        </li>
                        <li>
                          <div>45m</div>
                        </li>
                        <li>
                          <div>40m</div>
                        </li>
                        <li>
                          <div>35m</div>
                        </li>
                        <li>
                          <div>30m</div>
                        </li>
                        <li>
                          <div>25m</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-sm-4">
                  <div className="tabsTwo">
                    <div className="inside_Two">
                      <div className="x--box">
                        <div className="x-box"></div>
                      </div>
                      <br />
                      <br />
                      <div className="x-box-cont d-flex">
                        <strong>
                          Desktop<p className="parag">50%</p>
                        </strong>
                        <strong>
                          Tab<p className="parags">40%</p>
                        </strong>
                        <strong>
                          Mobile<p className="paragg">32%</p>
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panel;
