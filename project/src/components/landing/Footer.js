import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import image3 from "../images/google-removebg.png";
import { BsFacebook } from "react-icons/bs";
import { AiOutlineTwitter } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";
import { ImPinterest } from "react-icons/im";
import API_URL from "../../Url";

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
        const res = await axios.get(`${API_URL.user}/pages/all-sections`);
        setStates({ loading: false, error: false });
        setSections(res.data);
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
                {section.children[0] && <h5>{section.name}</h5>}
                <ul>
                  {section.children.map((page, index) => (
                    <li
                      key={index}
                      onClick={() => navPage(page, section)}
                      className="cursor-pointer hover:text-gray-400 flex flex-row-reverse gap-3 items-center"
                    >
                      <span>{page.title}</span>
                      {page?.icon && (
                        <span>
                          {" "}
                          <img
                            src={`${API_URL.user}/${page?.icon.substring(
                              page?.icon?.indexOf("uploads/")
                            )}`}
                            alt="default"
                            className="object-cover h-[20px] w-[20px] rounded-md"
                          />
                        </span>
                      )}
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
          <Link to="/blog" className="f-list no-underline text-black ">
            <p className="hover:text-gray-400">Our Blog</p>
          </Link>
          <h5>Copyright &copy; kxc Inc.2023</h5>
        </div>
      </div>
      <div className="mobile--footer">
        <div className="f_conts flex flex-col py-2 ml-0">
          <div className="f-cont flex flex-col">
            {sections?.map((section, index) => (
              <div className="footer-content" key={index}>
                <h5>{section.name}</h5>
                <ul>
                  {section.children.map((page, index) => (
                    <li
                      key={index}
                      onClick={() => navPage(page, section)}
                      className="cursor-pointer hover:text-gray-400 flex flex-row-reverse gap-3 items-center"
                    >
                      <span>{page.title}</span>
                      {page?.icon && (
                        <span>
                          {" "}
                          <img
                            src={`${API_URL.user}/${page?.icon.substring(
                              page?.icon?.indexOf("uploads/")
                            )}`}
                            alt="default"
                            className="object-cover h-[20px] w-[20px] rounded-md"
                          />
                        </span>
                      )}
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

        <br />
        <div className="f-list">
          <Link
            to="/blog"
            className="footer-content mt-2 no-underline text-black hover:text-gray-400"
          >
            <p className="hover:text-gray-400">Our Blog</p>
          </Link>
          <h5>Copyright &copy; kxc Inc.2023</h5>
        </div>
      </div>
    </div>
  );
}

export default Footer;
