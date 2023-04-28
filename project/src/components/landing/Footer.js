import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import image3 from "../images/google-removebg.png";
import { BsFacebook } from "react-icons/bs";
import { AiOutlineTwitter } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";
import { ImPinterest } from "react-icons/im";

function Footer() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });

  //get sections
  useEffect(() => {
    const getSections = async () => {
      try {
        const res = await axios.get(
          `http://15.188.62.53:3000/pages/all-sections`
        );
        setStates({ loading: false, error: false });
        setSections(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getSections();
  }, []);

  const navPage = (page, section) => {
    sessionStorage.setItem("page", page.title);
    sessionStorage.setItem("section", section.name);
    navigate(`/sections/${section.name}/${page.title}`);
  };

  return (
    <div>
      <div className="footer">
        <div className="foo-ter d-flex">
          <div className="ffter d-flex">
            {sections?.map((section, index) => (
              <div className="footer-content" key={index}>
                <h5>{section.name}</h5>
                <ul>
                  {section.children.map((page, index) => (
                    <li
                      key={index}
                      onClick={() => navPage(page, section)}
                      className="cursor-pointer hover:text-gray-400"
                    >
                      {page.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* <div className="footer-content">
              <h5>Social</h5>
              <ul>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Pininterest</li>
              </ul>
            </div> */}
          </div>
          <div className="appimage">
            <h5>Get our free apps</h5>
            <div className="footer_image">
              <img src={image3} alt="" />
            </div>
          </div>
        </div>
        <br />

        <div className="border_line"></div>
        <br />
        <div className="f-list">
          <h5>Copyright &copy; kxc Inc.2023</h5>
        </div>
      </div>
      <div className="mobile--footer">
        <div className="f_conts">
          <div className="f-cont d-flex pt-5">
            {sections?.map((section, index) => (
              <div className="footer-content" key={index}>
                <h5>{section.name}</h5>
                <ul>
                  {section.children.map((page, index) => (
                    <li key={index} onClick={() => navPage(page, section)}>
                      {page.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* <div className="footer--content">
              <h5>Social</h5>
              <div className="facebook d-flex gap-2">
                <div>
                  <BsFacebook />
                </div>
                Facebook
              </div>
              <div className="facebook d-flex gap-2">
                <div>
                  <AiOutlineTwitter />
                </div>
                Twitter
              </div>
              <div className="facebook d-flex gap-2">
                <div>
                  <IoLogoInstagram />
                </div>
                Instagram
              </div>
              <div className="facebook d-flex gap-2">
                <div>
                  <ImPinterest />
                </div>
                Pininterest
              </div>
            </div>
            */}
          </div>
          <div className="appimage">
            <h5>Get our free apps</h5>
            <div className="images-app d-flex gap-1">
              <div className="footer_image">
                <img src={image3} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="border_line"></div>

        <div className="f-list">
          <br />
          <div className="f-list">
            <h5>Copyright &copy; kxc Inc.2023</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
