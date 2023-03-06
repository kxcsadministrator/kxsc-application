import { useState } from "react";
import { BsBarChart } from "react-icons/bs";
import { RiMessage2Line } from "react-icons/ri";
import { AiFillFormatPainter } from "react-icons/ai";
import { AiFillHdd } from "react-icons/ai";
import { SiRoamresearch } from "react-icons/si";
import { FaGalacticRepublic } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import Dark from "../Dark";
import { CgChevronDown } from "react-icons/cg";
import "./admin.css";

function Sidebar() {
  const [msgMenu, setMsgMenu] = useState(false);
  const [catMenu, setCatMenu] = useState(false);
  const [resourceMenu, setResourceMenu] = useState(false);
  const [mppMenu, setMppMenu] = useState(false);
  const [mriMenu, setMriMenu] = useState(false);
  const [usersMenu, setUsersMenu] = useState(false);

  return (
    <div className="sidebar_container">
      {/* Logo Section*/}
      <div className="border-b-2 border-gray-400 pb-3">
        <div className="bg-gray-400 rounded-md h-[60px] w-[80%] mx-auto p-1">
          <h5 className="text-white">KXC Inc.</h5>
        </div>
      </div>
      {/* nav Section*/}
      <div className="grid gap-4 w-[80%] mx-auto text-tgray">
        {/* dashboard Link*/}
        <Link
          className="flex gap-3 items-center px-1 py-1 no-underline link text-tgray"
          to="/admin"
        >
          <BsBarChart />
          <h5 className="text-base">Dashboard</h5>
        </Link>
        {/* Message Section - text and Menu*/}
        <div className={"menu  " + (msgMenu && "active")}>
          <div className="menu_content" onClick={() => setMsgMenu(!msgMenu)}>
            <div className="content">
              <RiMessage2Line />
              <h5>Manage Message</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Msg Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/">
              <p>Resources Pending Aprroval</p>
            </Link>
            <Link className="link" to="/">
              <p>View Messages</p>
            </Link>
            <Link className="link" to="/">
              <p>Send Message</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Category Section - text and Menu*/}
        <div className={"menu " + (catMenu && "active")}>
          <div className="menu_content" onClick={() => setCatMenu(!catMenu)}>
            <div className="content">
              <AiFillFormatPainter />
              <h5>Manage Categories</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Category  Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/">
              <p>Create Category</p>
            </Link>
            <Link className="link" to="/">
              <p>Create Sub-category</p>
            </Link>
            <Link className="link" to="/">
              <p>List of Categories</p>
            </Link>
            <Link className="link" to="/">
              <p>List of Sub-categories</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Resource Section - text and Menu*/}
        <div className={"menu " + (resourceMenu && "active")}>
          <div
            className="menu_content"
            onClick={() => setResourceMenu(!resourceMenu)}
          >
            <div className="content">
              <AiFillHdd />
              <h5>Manage Resources</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Resource Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/">
              <p>Add Resource Items</p>
            </Link>
            <Link className="link" to="/admin/resources">
              <p>View All Resource Items</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Manage Public Portal Section - text and Menu*/}
        <div className={"menu " + (mppMenu && "active")}>
          <div className="menu_content" onClick={() => setMppMenu(!mppMenu)}>
            <div className="content">
              <FaGalacticRepublic />
              <h5>Manage Public Portal</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Resource Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/">
              <p>Manage Header Section</p>
            </Link>
            <Link className="link" to="/">
              <p>Manage Footer Section</p>
            </Link>
            <Link className="link" to="/">
              <p>Create Pages</p>
            </Link>
            <Link className="link" to="/">
              <p>List of Pages</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Manage Research Institutes Section - text and Menu*/}
        <div className={"menu " + (mriMenu && "active")}>
          <div className="menu_content" onClick={() => setMriMenu(!mriMenu)}>
            <div className="content">
              <SiRoamresearch />
              <h5>Manage Research Institutes</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Resource Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/admin/create-institutes">
              <p>Create RI</p>
            </Link>
            <Link className="link" to="/admin/institutes">
              <p>List of RIs</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Manage Research Institutes Section - text and Menu*/}
        <div className={"menu " + (usersMenu && "active")}>
          <div
            className="menu_content"
            onClick={() => setUsersMenu(!usersMenu)}
          >
            <div className="content">
              <FiUsers />
              <h5>Manage Users</h5>
            </div>
            <div className="toggleImg">
              <CgChevronDown />
            </div>
          </div>
          {/* Resource Menu*/}
          <div className="dropdown_menu">
            <Link className="link" to="/admin/create-user">
              <p>Create Users</p>
            </Link>
            <Link className="link" to="/admin/users">
              <p>All users</p>
            </Link>
          </div>
          <div className="dash" />
        </div>
        {/* Blog Items */}
        <Link to="/admin" className="content_1 link">
          <SiRoamresearch />
          <h5>Manage Blog Items</h5>
        </Link>

        {/* Blog Items */}
        <Link to="/admin" className="content_1 link">
          <GoSignIn />
          <h5>Manage Newsletter SignUp</h5>
        </Link>
      </div>

      {/* Dark Section */}
      <div className="w-[80%] mx-auto">
        <Dark />
      </div>
    </div>
  );
}

export default Sidebar;
