import React from "react";
import image3 from "../images/google-removebg.png";
import { BsFacebook } from "react-icons/bs";
import { AiOutlineTwitter } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";
import { ImPinterest } from "react-icons/im";

function Footer() {
  return (
    <div>
      <div className="footer">
        <div className="foo-ter d-flex">
          <div className="ffter d-flex">
            <div className="footer-content">
              <h5>About</h5>
              <ul>
                <li>About</li>
                <li>Press</li>
                <li>Our blog</li>
                <li>Join our team</li>
                <li>Contact us</li>
                <li>Invite us</li>
              </ul>
            </div>
            <div className="footer-content">
              <h5>Support</h5>
              <ul>
                <li>Help/FAQ</li>
                <li>Acessibility</li>
                <li>Purchase help</li>
                <li>Adchoices</li>
                <li>Publishers</li>
              </ul>
            </div>
            <div className="footer-content">
              <h5>Legal</h5>
              <ul>
                <li>Terms</li>
                <li>Privacy</li>
                <li>Copyright</li>
                <li>Cookie preferences</li>
              </ul>
            </div>
            <div className="footer-content">
              <h5>Social</h5>
              <ul>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>Pininterest</li>
              </ul>
            </div>
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
            <div className="footer-content">
              <h5>About</h5>
              <ul className="">
                <li>About</li>
                <li>Press</li>
                <li>Our blog</li>
                <li>Join our team</li>
                <li>Contact us</li>
                <li>Invite us</li>
              </ul>
            </div>
            <div className="footer-content">
              <h5>Support</h5>
              <ul>
                <li>Help / FAQ</li>
                <li>Acessibility</li>
                <li>Purchase help</li>
                <li>Adchoices</li>
                <li>Publishers</li>
              </ul>
            </div>
          </div>
          <div className="f-cont d-flex pt-5">
            <div className="footer-content">
              <h5>Legal</h5>
              <ul className="">
                <li>Terms</li>
                <li>Privacy</li>
                <li>Copyright</li>
                <li>Cookie preferences</li>
                <li>
                  Do not sell or share my
                  <br /> personal information
                </li>
              </ul>
            </div>
            <div className="footer--content">
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
