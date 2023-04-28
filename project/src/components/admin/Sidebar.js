import { useState } from "react";
import { BsBarChart } from "react-icons/bs";
import { RiMessage2Line, RiMenu2Line, RiCloseLine } from "react-icons/ri";
import { AiFillFormatPainter, AiOutlineLogout } from "react-icons/ai";
import { AiFillHdd } from "react-icons/ai";
import { SiRoamresearch } from "react-icons/si";
import { FaGalacticRepublic, FaUserAlt } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { CgChevronDown } from "react-icons/cg";
import { useContext } from "react";
import { Context } from "../../context/Context";
import "./admin.css";

function Sidebar() {
  const { user, dispatch } = useContext(Context);
  const [msgMenu, setMsgMenu] = useState(false);
  const [catMenu, setCatMenu] = useState(false);
  const [resourceMenu, setResourceMenu] = useState(false);
  const [mppMenu, setMppMenu] = useState(false);
  const [mriMenu, setMriMenu] = useState(false);
  const [usersMenu, setUsersMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const navigate = useNavigate();

  //show hamburger menu
  function displayMenu() {
    setNavOpen(!navOpen);
    if (!navOpen) {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "visible";
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  const viewInstitute = (institute) => {
    sessionStorage.setItem("id", institute._id);
    navigate(`/admin/institutes/${institute.name}`);
  };

  return (
    <div className={"sidebar " + (navOpen && "active")}>
      <div className="sidebar_container">
        {/* Logo Section*/}
        <div className="border-b-2 border-gray-400 pb-3">
          <div className="w-[60%] mx-auto">
            <img src="/logo.png" alt="logo" className="w-full h-full" />
          </div>
        </div>
        {/* nav Section*/}
        {user.superadmin ? (
          <div className="grid gap-3 w-[80%] mx-auto text-tgray">
            {/* dashboard Link*/}
            <Link
              className="flex gap-3 items-center px-1 py-1 no-underline link text-tgray"
              to="/admin"
              onClick={() => setNavOpen(false)}
            >
              <BsBarChart />
              <h5 className="text-base md:text-sm lg:text-base">Dashboard</h5>
            </Link>

            {/* Message Section - text and Menu*/}
            <div className={"menus  " + (msgMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setMsgMenu(!msgMenu)}
              >
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
                <Link className="link" to="/admin/messages">
                  <p>My Messages</p>
                </Link>
                <Link className="link" to="/admin/create-message">
                  <p>Send Message</p>
                </Link>
              </div>
              <div className="dash" />
            </div>
            {/* Category Section - text and Menu*/}
            <div className={"menus " + (catMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setCatMenu(!catMenu)}
              >
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
                <Link className="link" to="/admin/create-category">
                  <p>Create Category</p>
                </Link>
                <Link className="link" to="/admin/categories">
                  <p>List of Categories</p>
                </Link>
              </div>
              <div className="dash" />
            </div>
            {/* Resource Section - text and Menu*/}
            <div className={"menus " + (resourceMenu && "active")}>
              <div
                className="menu_contents"
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
                <Link className="link" to="/admin/resources/pending">
                  <p>Resources Pending Approval</p>
                </Link>
                <Link className="link" to="/admin/resources">
                  <p>View All Resource Items</p>
                </Link>
              </div>
              <div className="dash" />
            </div>
            {/* Manage Public Portal Section - text and Menu*/}
            <div className={"menus " + (mppMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setMppMenu(!mppMenu)}
              >
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
                <Link className="link" to="/admin/sections">
                  <p>Manage Footer Section</p>
                </Link>
                <Link className="link" to="/admin/create-section">
                  <p>Create Footer Section</p>
                </Link>
              </div>
              <div className="dash" />
            </div>
            {/* Manage Research Institutes Section - text and Menu*/}
            <div className={"menus " + (mriMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setMriMenu(!mriMenu)}
              >
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
            {/* Manage User Section - text and Menu*/}
            <div className={"menus " + (usersMenu && "active")}>
              <div
                className="menu_contents"
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

              {/* User Menu*/}
              <div className="dropdown_menu">
                <Link className="link" to="/admin/create-user">
                  <p>Create Users</p>
                </Link>
                <Link className="link" to="/admin/users">
                  <p>All users</p>
                </Link>
                <Link className="link" to="/admin/user_requests">
                  <p>User Requests</p>
                </Link>
              </div>

              <div className="dash" />
            </div>

            {/* Blog Items */}
            <div className={"menus " + (blogOpen && "active")}>
              <div
                className="menu_contents"
                onClick={() => setBlogOpen(!blogOpen)}
              >
                <div className="content">
                  <SiRoamresearch />
                  <h5>Manage Blog Items</h5>
                </div>
                <div className="toggleImg">
                  <CgChevronDown />
                </div>
              </div>

              {/* User Menu*/}
              <div className="dropdown_menu">
                <Link className="link" to="/admin/create-blog">
                  <p>Create Blog</p>
                </Link>
                <Link className="link" to="/admin/blog">
                  <p>All Blogs</p>
                </Link>
              </div>
            </div>

            {/* Blog Items */}
            <Link to="/admin" className="content_1 link">
              <GoSignIn />
              <h5>Manage Newsletter SignUp</h5>
            </Link>
            <div className="content_1 link" onClick={() => logout()}>
              <AiOutlineLogout />
              <h5>Log Out</h5>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center gap-3 w-[80%] mx-auto text-tgray">
            {/* Resource Section - text and Menu*/}
            <Link
              className="flex gap-3 items-center px-1 py-1 no-underline link text-tgray"
              to="/admin"
              onClick={() => setNavOpen(false)}
            >
              <BsBarChart />
              <h5 className="text-base md:text-sm lg:text-base">Dashboard</h5>
            </Link>
            {/* Message Section - text and Menu*/}
            <div className={"menus  " + (msgMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setMsgMenu(!msgMenu)}
              >
                <div className="content">
                  <RiMessage2Line />
                  <h5>Messages</h5>
                </div>
                <div className="toggleImg">
                  <CgChevronDown />
                </div>
              </div>
              {/* Msg Menu*/}
              <div className="dropdown_menu">
                <Link className="link" to="/admin/messages">
                  <p>My Messages</p>
                </Link>
                <Link className="link" to="/admin/create-message">
                  <p>Send Message</p>
                </Link>
              </div>
              <div className="dash" />
            </div>

            <div className={"menus " + (resourceMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setResourceMenu(!resourceMenu)}
              >
                <div className="content">
                  <AiFillHdd />
                  <h5>My Resources</h5>
                </div>
                <div className="toggleImg">
                  <CgChevronDown />
                </div>
              </div>
              {/* Resource Menu*/}
              <div className="dropdown_menu">
                <Link className="link" to="/admin/public_resources">
                  <p>View public Resources</p>
                </Link>
                <Link className="link" to="/admin/resources">
                  <p>My Resource Items</p>
                </Link>
                {user?.main_institute?.name && (
                  <Link className="link" to="/admin/other_resources">
                    <p>Other Institute Resources</p>
                  </Link>
                )}
              </div>
              <div className="dash" />
            </div>

            {/* Manage Research Institutes Section - text and Menu*/}
            <div className={"menus " + (mriMenu && "active")}>
              <div
                className="menu_contents"
                onClick={() => setMriMenu(!mriMenu)}
              >
                <div className="content">
                  <SiRoamresearch />
                  <h5>My Institutes</h5>
                </div>
                <div className="toggleImg">
                  <CgChevronDown />
                </div>
              </div>
              {/* Resource Menu*/}
              <div className="dropdown_menu">
                <div
                  className="link"
                  onClick={() => viewInstitute(user.main_institute)}
                >
                  <p>{user?.main_institute?.name}</p>
                </div>
                <Link className="link" to="/admin/institutes">
                  <p>View all institute</p>
                </Link>
              </div>
              <div className="dash" />
            </div>

            {/* Profile */}
            <Link to="/admin/profile" className="content_1 link">
              <FaUserAlt />
              <h5>My profile</h5>
            </Link>

            <div className="content_1 link" onClick={() => logout()}>
              <AiOutlineLogout />
              <h5>Log Out</h5>
            </div>
          </div>
        )}
      </div>
      <div className="toggleMenu" onClick={() => displayMenu()}>
        <div className="hamburgers">
          <RiMenu2Line />
        </div>
        <div className="close">
          <RiCloseLine />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
