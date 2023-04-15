import React from "react";
// import { Image } from 'react-bootstrap';
import { Link } from "react-router-dom";
// import HorizontalScroll from 'react-scroll-horizontal';
// import image from '../images/numbers.webp';

function Compo() {
  return (
    <div>
      <div className="inn-fo">
        <Link to={"/cateLanding"} className="line">
          <div className="inn">
            <b>Information Technology</b>
          </div>
        </Link>
        <br />
        <Link to={"/production"} className="line">
          <div className="inn">
            <b>Production</b>
          </div>
        </Link>
        <br />
        <Link to={"/#"} className="line">
          <div className="inn">
            <b>Manufacturing</b>
          </div>
        </Link>
        <br />
        <Link to={"/#"} className="line">
          <div className="inn">
            <b>Engineering</b>
          </div>
        </Link>
        <br />
        <Link to={"/#"} className="line">
          <div className="inn">
            <b>Science</b>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Compo;
