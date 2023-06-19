// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import Login from "./pages/login/Login";
import Panel from "./pages/admin/panel/Panel";
import Users from "./pages/admin/users/Users";
import CreateUser from "./pages/admin/users/CreateUser";
import Institutes from "./pages/admin/institutes/Institutes";
import CreateInstitutes from "./pages/admin/institutes/CreateInstitutes";
import Resources from "./pages/admin/resources/Resources";
import Institute from "./pages/admin/institutes/Institute";
import Resource from "./pages/admin/resources/Resource";
import SignUp from "./pages/sign_up/SignUp";
import PendingResources from "./pages/admin/resources/PendingResources";
import PublicResources from "./pages/admin/resources/PublicResources";
import Categories from "./pages/admin/categories/Categories";
import Category from "./pages/admin/categories/Category";
import CreateCategory from "./pages/admin/categories/CreateCategory";
import Messages from "./pages/admin/messages/Messages";
import CreateMessage from "./pages/admin/messages/CreateMessage";
import Task from "./pages/task/Task";
import ResetEmail from "./pages/admin/password-reset/ResetEmail";
import Reset from "./pages/admin/password-reset/Reset";
import Profile from "./pages/admin/profile/Profile";
import Search from "./pages/admin/Search";
import OtherResources from "./pages/admin/resources/OtherResources";
import UserRequests from "./pages/admin/users/UserRequests";
import LandingPage from "./components/landing/LandingPage";
import LandingsearchIndividualpage from "./components/landing/LandingsearchIndividualpage";
import Footer from "./components/landing/Footer";
import CategoryLanding from "./components/landing/CategoryLanding";
import CategorysinglePage from "./components/landing/CategorysinglePage";
import ModalOne from "./components/landing/ModalOne";
import ModalTwo from "./components/landing/ModalTwo";
import LandingsearchResult from "./components/landing/LandingsearchResult";
import Ham from "./components/landing/Ham";
import Landmobile from "./components/landing/Landmobile";
import Compo from "./components/landing/Compo";
import Production from "./components/landing/Production";
import LandingSearchCategory from "./components/landing/LandingSearchCategory";
import CreateFooterSection from "./pages/admin/public-portal/CreateFooterSection";
import FooterSection from "./pages/admin/public-portal/FooterSection";
import SingleSection from "./pages/admin/public-portal/SingleSection";
import CreateBlog from "./pages/admin/blog/CreateBlog";
import Blog from "./pages/admin/blog/Blog";
import SingleBlog from "./pages/admin/blog/SingleBlog";
import SinglePage from "./pages/admin/public-portal/SinglePage";
import LandingBlog from "./components/landing/LandingBlog";
import LandingBlogDetails from "./components/landing/LandingBlogDetails";
import LandingSectionPage from "./components/landing/LandingSectionPage";
import ResourceType from "./pages/admin/resource-type/ResourceType";
import CreateType from "./pages/admin/resource-type/CreateType";
import LandingSearchTypes from "./components/landing/LandingSearchTypes";
import LoginPublic from "./pages/login/LoginPublic";
import SignUpPublic from "./pages/sign_up/SignUpPublic";
import PublicProfile from "./components/landing/PublicProfile";

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/login" element={user ? <Panel /> : <Login />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route
            path="/public/login"
            element={user ? <LandingPage /> : <LoginPublic />}
          />
          <Route path="/public/sign_up" element={<SignUpPublic />} />
          <Route path="/admin" element={user ? <Panel /> : <Login />} />
          <Route path="/admin/users" element={user ? <Users /> : <Login />} />
          <Route
            path="/public/profile"
            element={user ? <PublicProfile /> : <Login />}
          />
          <Route
            path="/admin/user_requests"
            element={user ? <UserRequests /> : <Login />}
          />
          <Route
            path="/admin/create-user"
            element={user ? <CreateUser /> : <Login />}
          />
          <Route
            path="/admin/messages"
            element={user ? <Messages /> : <Login />}
          />
          <Route
            path="/admin/create-message"
            element={user ? <CreateMessage /> : <Login />}
          />
          <Route
            path="/admin/institutes"
            element={user ? <Institutes /> : <Login />}
          />
          <Route
            path="/admin/create-institutes"
            element={user ? <CreateInstitutes /> : <Login />}
          />
          <Route
            path="/admin/institutes/:name"
            element={user ? <Institute /> : <Login />}
          />
          <Route
            path="/admin/tasks/:name"
            element={user ? <Task /> : <Login />}
          />
          <Route
            path="/admin/resources/:name"
            element={user ? <Resource /> : <Login />}
          />
          <Route
            path="/admin/resources"
            element={user ? <Resources /> : <Login />}
          />
          <Route
            path="/admin/resources/pending"
            element={user ? <PendingResources /> : <Login />}
          />
          <Route
            path="/admin/public_resources"
            element={user ? <PublicResources /> : <Login />}
          />
          <Route
            path="/admin/other_resources"
            element={user ? <OtherResources /> : <Login />}
          />
          <Route
            path="/admin/resource-types"
            element={user ? <ResourceType /> : <Login />}
          />
          <Route
            path="/admin/create-resource-type"
            element={user ? <CreateType /> : <Login />}
          />
          <Route
            path="/admin/categories"
            element={user ? <Categories /> : <Login />}
          />
          <Route
            path="/admin/category/:name"
            element={user ? <Category /> : <Login />}
          />
          <Route
            path="/admin/create-category"
            element={user ? <CreateCategory /> : <Login />}
          />
          <Route path="/admin/forgot-password" element={<ResetEmail />} />
          <Route path="/password-reset" element={<Reset />} />
          <Route
            path="/admin/profile"
            element={user ? <Profile /> : <Login />}
          />
          <Route path="/admin/search" element={user ? <Search /> : <Login />} />
          <Route
            path="/admin/create-section"
            element={user ? <CreateFooterSection /> : <Login />}
          />
          <Route
            path="/admin/sections"
            element={user ? <FooterSection /> : <Login />}
          />
          <Route
            path="/admin/sections/:name"
            element={user ? <SingleSection /> : <Login />}
          />
          <Route
            path="/admin/sections/:name/:page"
            element={user ? <SinglePage /> : <Login />}
          />
          <Route
            path="/admin/create-blog"
            element={user ? <CreateBlog /> : <Login />}
          />
          <Route path="/admin/blog" element={user ? <Blog /> : <Login />} />
          <Route
            path="/admin/blog/:name"
            element={user ? <SingleBlog /> : <Login />}
          />

          <Route path="/" element={<LandingPage />} />
          <Route
            path="/resource_details"
            element={<LandingsearchIndividualpage />}
          />
          <Route path="/blog" element={<LandingBlog />} />
          <Route path="/blog/:name" element={<LandingBlogDetails />} />
          <Route path="cateLanding" element={<CategoryLanding />} />
          <Route
            path="/sections/:name/:name"
            element={<LandingSectionPage />}
          />
          <Route path="/resourceSearch" element={<LandingsearchResult />} />
          <Route
            path="/search_by_category"
            element={<LandingSearchCategory />}
          />
          <Route path="/search_by_type" element={<LandingSearchTypes />} />
          <Route path="Modal" element={<ModalOne />} />
          <Route path="Modall" element={<ModalTwo />} />
          <Route path="Ham" element={<Ham />} />
          <Route path="Landmobile" element={<Landmobile />} />
          <Route path="Compo" element={<Compo />} />
          <Route path="production" element={<Production />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
