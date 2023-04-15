import React, { useState } from "react";
import Compo from "./Compo";
import image6 from "../images/kxcc.png";
import { IoIosSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ModalOne from "./ModalOne";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Ham from "./Ham";

function Production() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div
        className="landing-nav bg-light"
        style={{ position: "sticky", top: "0" }}
      >
        <div className="navv d-flex mt-2">
          <div className="hamburger--menu">
            <Ham />
          </div>
          <div className="nav-bar d-flex">
            <Link to={"/"}>
              <div className="link-image">
                <img src={image6} alt="" />
              </div>
            </Link>
            <div className="nav-txt">
              <h5>Knowledge Exchange</h5>
            </div>
          </div>
          <div className="inputt p-2">
            <div className="input-group">
              <span className="in-search bg-light input-group-text">
                Learning
              </span>
              <input
                type="text"
                className="form-control"
                aria-label="Dollar amount (with dot and two decimal places)"
                placeholder="Search skills, subjects or software"
              />
              <span className="in-search bg-light input-group-text">
                <IoIosSearch />
              </span>
            </div>
          </div>

          <div className="prof-section d-flex  p-2">
            <div className="profile p-1">
              <CgProfile />
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <ModalOne />
              </Modal.Body>
            </Modal>

            <Button className="sbtn" variant="primary" onClick={handleShow}>
              Sign in
            </Button>
          </div>
        </div>
      </div>
      <div className="inputtt p-2">
        <div className="input-group">
          <span className="in-search bg-light input-group-text">Learning</span>
          <input
            type="text"
            className="form-control"
            aria-label="Dollar amount (with dot and two decimal places)"
            placeholder="Search skills, subjects or software"
          />
          <span className="in-search bg-light input-group-text">
            <IoIosSearch />
          </span>
        </div>
      </div>
      <br />
      <div className="four-color bg-light">
        <div className="dd d-flex gap-3 pt-3">
          <div>
            <h5>Research for:</h5>
          </div>
          <div>
            <h5>Business</h5>
          </div>
          <div>
            <h5>Higher Education</h5>
          </div>
          <div>
            <h5>Government</h5>
          </div>
        </div>
      </div>
      <br />
      <div className="info d-flex">
        <div className="online-categories">
          <div clas>
            <h5>All Online Categories</h5>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque
              quos tenetur voluptate iure accusantium dolore asperiores
              consectetur recusandae, sed adipisci, magnam quaerat ab animi, cum
              in debitis necessitatibus minus eligendi!
            </p>
          </div>
          <br />
          <div className="info d-flex">
            <div className="compo">
              <Compo />
            </div>
            <div className="techsss">
              <div className="tech-topics d-flex">
                <div>
                  <b>StarLink</b>
                </div>
                <div>
                  <button className="show-btn">Show all</button>
                </div>
              </div>
              <br />
              <div className="ulist d-flex">
                <div className="g_g">
                  <div className="ggg">
                    <h5>IT Help Desk</h5>
                  </div>
                  <div className="gg">
                    <h5>Cloud Operating Systems</h5>
                    <h5>Software Support</h5>
                    <h5>Upgrade and Maintenance</h5>
                    <h5>Help Desk Skills</h5>
                    <h5>Operatin System Distribution</h5>
                  </div>
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>DevOps</h5>
                    </div>
                    <div className="gg">
                      <h5>DevOps Foundation</h5>
                      <h5>DevOps Tools</h5>
                      <h5>Agile Software Development</h5>
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>Software Development</h5>
                    </div>
                    <div className="gg">
                      <h5>Software Architecture</h5>
                      <h5>Microsoft Development</h5>
                      <h5>Game Development</h5>
                      <h5>Software Design Patterns</h5>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="ggg">
                    <h5>Mobile Development</h5>
                  </div>
                  <div className="gg">
                    <h5>Android Development</h5>
                    <h5>Cross-Platform Development</h5>
                    <h5>iOS Development</h5>
                    <h5>Mobile Game Development</h5>
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>Data Science</h5>
                    </div>
                    <div className="gg">
                      <h5>Data Governance</h5>
                      <h5>Business Intelligence</h5>
                      <h5>Cryptocurrency</h5>
                      <h5>Machine Learning</h5>
                      <h5>Data Visualization</h5>
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>Database Management</h5>
                    </div>
                    <div className="gg">
                      <h5>Data Resource Management</h5>
                      <h5>Database Administration</h5>
                      <h5>Database Development</h5>
                      <h5>Data Centers</h5>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="ggg">
                    <h5>Cloud Computing</h5>
                  </div>
                  <div className="gg">
                    <h5>Cloud Storage</h5>
                    <h5>Software Security</h5>
                    <h5>IBM Center for Cloud Training</h5>
                    <h5>Cloud Administration</h5>
                    <h5>Cloud Services</h5>
                  </div>
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>
                        Network and System
                        <br /> Administration
                      </h5>
                    </div>
                    <div className="gg">
                      <h5>Enterprise Content</h5>
                      <h5>Management</h5>
                      <h5>Mobile Device Management</h5>
                      <h5>Software Administration</h5>
                      <h5>Internet of Things</h5>
                      <h5>IT Automation</h5>
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className="g_g">
                    <div className="ggg">
                      <h5>Web Development</h5>
                    </div>
                    <div className="gg">
                      <h5>Content Management Systems</h5>
                      <h5>(CMS)</h5>
                      <h5>JavaAcript Frameworks</h5>
                      <h5>BackEnd Web Development</h5>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="ggg">
                    <h5>Software</h5>
                  </div>
                  <div className="gg">
                    <h5>Java</h5>
                    <h5>C++</h5>
                    <h5>Linux</h5>
                    <h5>ASP.NET</h5>
                    <h5>Azure</h5>
                    <h5>Tableau</h5>
                    <h5>Javascript</h5>
                    <h5>Windows Server</h5>
                    <h5>WordPress</h5>
                    <h5>Python</h5>
                    <h5>SQL</h5>
                    <h5>React.js</h5>
                    <h5>Cisco</h5>
                    <h5>Kubernetes</h5>
                    <h5>Amazon Web Services</h5>
                    <h5>Microsoft 365</h5>
                    <h5>Power BI</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Production;
