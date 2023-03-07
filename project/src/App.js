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
import CreateResource from "./pages/admin/resources/CreateResource";

function App() {
  const { user } = useContext(Context);
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route
            path="/admin"
            element={user?.superadmin ? <Panel /> : <Institutes />}
          />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/institutes" element={<Institutes />} />
          <Route
            path="/admin/create-institutes"
            element={<CreateInstitutes />}
          />
          <Route path="/admin/institutes/:name" element={<Institute />} />
          <Route path="/admin/resources/:name" element={<Resource />} />
          <Route path="/admin/resources" element={<Resources />} />
          <Route path="/admin/create-resource" element={<CreateResource />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
