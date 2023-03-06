import React from "react";
import { BsBarChart } from "react-icons/bs";
import { RiMessage2Line } from "react-icons/ri";
import { AiFillFormatPainter } from "react-icons/ai";
import { AiFillHdd } from "react-icons/ai";
import { SiRoamresearch } from "react-icons/si";
import { FaGalacticRepublic } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dark from "./Dark";

function Compo() {
  return (
    <div>
      <div className="main-panel">
        <div className="bg-txt">
          <br />
          <div className="bgg rounded-3">
            <div>
              <h5 className="kxc p-2 text-white">KXC Inc.</h5>
            </div>
          </div>
          <br />
          <div className="border-line"></div>
        </div>
        <br />
        <div className="dashboard">
          <div className="dash_board">
            <Link className="line" to="/">
              <div className="dash d-flex text-white gap-3 p-2">
                <div>
                  <BsBarChart />
                </div>
                <div>
                  <h5 className="ff">Dashboard</h5>
                </div>
              </div>
            </Link>
            <div className="dash d-flex text-white p-2">
              <div>
                <RiMessage2Line />
              </div>
              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h5 className="accordion-header" id="flush-headingOne">
                    <button
                      className="a-btn accordion-button collapsed bg-black text-whit"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne"
                      aria-expanded="false"
                      aria-controls="flush-collapseOne"
                    >
                      Manage Messages
                    </button>
                  </h5>
                  <div
                    id="flush-collapseOne"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body text-black bg-black">
                      <Link to={"/approval"} className="line">
                        <p>Resources Pending Approval</p>
                      </Link>
                      <Link to={"/viewMsg"} className="line">
                        <p>View Messages</p>
                      </Link>
                      <Link to={"/send"} className="line">
                        <p>Send Message</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dash d-flex text-white p-2">
              <div>
                <AiFillFormatPainter />
              </div>
              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h5 className="accordion-header" id="flush-headingTwo">
                    <button
                      className="a-btn accordion-button collapsed bg-black text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo"
                      aria-expanded="false"
                      aria-controls="flush-collapseTwo"
                    >
                      Manage Categories
                    </button>
                  </h5>
                  <div
                    id="flush-collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingTwo"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body text-white bg-black">
                      <Link to={"/categories"} className="line">
                        <p>Create Category</p>
                      </Link>
                      <Link to={"/sub-category"} className="line">
                        <p>Create Sub-category</p>
                      </Link>
                      <Link to={"/List"} className="line">
                        <p>List of Categories</p>
                      </Link>
                      <Link to={"/sublist"} className="line">
                        <p>List of Sub-categories</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dash d-flex text-white p-2">
              <div>
                <AiFillHdd />
              </div>

              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h5 className="accordion-header" id="flush-headingThree">
                    <button
                      className="a-btn accordion-button collapsed bg-black text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree"
                      aria-expanded="false"
                      aria-controls="flush-collapseThree"
                    >
                      Manage Resources
                    </button>
                  </h5>
                  <div
                    id="flush-collapseThree"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingThree"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body text-white bg-black">
                      <Link to={"/add"} className="line">
                        <p>Add Resource items</p>
                      </Link>
                      <Link to={"/view"} className="line">
                        <p>View All Resource Items</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dash d-flex text-white p-2">
              <div>
                <FaGalacticRepublic />
              </div>

              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                <div className="accordion-item">
                  <h5 className="accordion-header" id="flush-headingFour">
                    <button
                      className="a-btn accordion-button collapsed bg-black text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFour"
                      aria-expanded="false"
                      aria-controls="flush-collapseFour"
                    >
                      Manage Messages
                    </button>
                  </h5>
                  <div
                    id="flush-collapseFour"
                    class="accordion-collapse collapse"
                    aria-labelledby="flush-headingFour"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body text-white bg-black">
                      <Link to={"/header"} className="line">
                        <p>Manage Header Section</p>
                      </Link>
                      <Link to={"/create"} className="line">
                        <p>Create Pages</p>
                      </Link>
                      <Link to={"/page"} className="line">
                        <p>List of Pages</p>
                      </Link>
                      <Link to={"/footer"} className="line">
                        <p>Manage Footer Section</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link className="line" to={`/research`}>
              <div className="dash d-flex text-white gap-3 p-2">
                <div>
                  <SiRoamresearch />
                </div>
                <div>
                  <h5 className="ff">Manage Research Int</h5>
                </div>
              </div>
            </Link>
            <Link className="line" to="/users">
              <div className="dash d-flex text-white gap-3 p-2">
                <div>
                  <FiUsers />
                </div>
                <div>
                  <h5 className="ff">Manage Users</h5>
                </div>
              </div>
            </Link>
            <Link className="line" to={`/blog`}>
              <div className="dash d-flex text-white gap-3 p-2">
                <div>
                  <SiRoamresearch />
                </div>
                <div>
                  <h5 className="ff">Manage Blog Items</h5>
                </div>
              </div>
            </Link>
            <Link className="line" to="/Sign">
              <div className="dash d-flex text-white gap-3 p-2">
                <div>
                  <GoSignIn />
                </div>
                <div>
                  <h5 className="ff">Manage newsletter SignUp</h5>
                </div>
              </div>
            </Link>
          </div>
          <br />
          <br />
          <div className="drk">
            <Dark />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compo;
