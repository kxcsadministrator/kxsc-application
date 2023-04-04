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

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/admin" element={<Panel />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/user_requests" element={<UserRequests />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/create-message" element={<CreateMessage />} />
          <Route path="/admin/institutes" element={<Institutes />} />
          <Route
            path="/admin/create-institutes"
            element={<CreateInstitutes />}
          />
          <Route path="/admin/institutes/:name" element={<Institute />} />
          <Route path="/admin/tasks/:name" element={<Task />} />
          <Route path="/admin/resources/:name" element={<Resource />} />
          <Route path="/admin/resources" element={<Resources />} />
          <Route
            path="/admin/resources/pending"
            element={<PendingResources />}
          />
          <Route path="/admin/public_resources" element={<PublicResources />} />
          <Route path="/admin/other_resources" element={<OtherResources />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/category/:name" element={<Category />} />
          <Route path="/admin/create-category" element={<CreateCategory />} />
          <Route path="/admin/forgot-password" element={<ResetEmail />} />
          <Route path="/password-reset" element={<Reset />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/search" element={<Search />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
