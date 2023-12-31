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
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err?.response?.data?.message,
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
              <div className="" key={index}>
                {section.children[0] && <h5>{section.name}</h5>}
                <div>
                  {section.children.map((page, index) => (
                    <div
                      key={index}
                      onClick={() => navPage(page, section)}
                      className="cursor-pointer hover:text-gray-400 flex  gap-3 items-center"
                    >
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
                      <span>{page.title}</span>
                    </div>
                  ))}
                </div>
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
          <p className="mb-2 font-semibold">Links</p>
          <Link to="/categories" className="no-underline text-black  ">
            <p className="hover:text-gray-400">All Categories</p>
          </Link>
          <Link to="/blog" className="no-underline text-black ">
            <p className="hover:text-gray-400 -mt-2">Our Blog</p>
          </Link>

          <h5>Powered by FMIST</h5>
        </div>
      </div>
      <div className="mobile--footer">
        <div className="footerM">
          <div className="">
            {sections?.map((section, index) => (
              <div className="flex flex-col my-4" key={index}>
                <h5>{section.name}</h5>

                {section.children.map((page, index) => (
                  <div
                    key={index}
                    onClick={() => navPage(page, section)}
                    className="cursor-pointer hover:text-gray-400 flex  gap-3 items-center -mt-1 mb-[10px]"
                  >
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
                    <span>{page.title}</span>
                  </div>
                ))}
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
          <p className="mb-3 font-semibold">Links</p>
          <Link to="/categories" className=" no-underline text-black ">
            <p className="hover:text-gray-400">All Categories</p>
          </Link>
          <Link to="/blog" className=" no-underline text-black ">
            <p className="hover:text-gray-400 -mt-2">Our Blog</p>
          </Link>

          <h5>Powered by FMIST</h5>
        </div>
      </div>
    </div>
  );
}

export default Footer;
